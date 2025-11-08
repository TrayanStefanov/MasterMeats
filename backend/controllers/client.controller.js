import Client from "../models/client.model.js";
import Reservation from "../models/reservation.model.js";

export const getAllClients = async (req, res) => {
  try {
    const {
      search,
      tags,
      status = "all",
      hideCompletedOnly = false,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const clientMatch = {};
    // Global fuzzy search across multiple fields
    if (search) {
      const regex = new RegExp(search, "i");
      clientMatch.$or = [
        { name: regex },
        { phone: regex },
        { email: regex },
        { tags: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }
    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim());
      clientMatch.tags = { $in: tagList };
    }

    // Aggregation pipeline for clients
    const pipeline = [
      { $match: clientMatch },
      // Lookup reservations
      {
        $lookup: {
          from: "reservations",
          let: { clientId: "$_id" },
          pipeline: [{ $match: { $expr: { $eq: ["$client", "$$clientId"] } } }],
          as: "reservations",
        },
      },
      // Compute totals and orderStatus
      {
        $addFields: {
          totalPaid: {
            $sum: {
              $map: {
                input: "$reservations",
                as: "r",
                in: {
                  $cond: [
                    "$$r.completed",
                    {
                      $subtract: [
                        "$$r.calculatedTotalAmmount",
                        "$$r.amountDue",
                      ],
                    },
                    0,
                  ],
                },
              },
            },
          },
          totalAmountDue: { $sum: "$reservations.amountDue" },
          totalOrders: { $size: "$reservations" },
          orderStatus: {
            $switch: {
              branches: [
                {
                  case: {
                    $gt: [
                      {
                        $size: {
                          $filter: {
                            input: "$reservations",
                            as: "r",
                            cond: {
                              $and: [
                                { $gt: ["$$r.amountDue", 0] },
                                { $eq: ["$$r.completed", false] },
                              ],
                            },
                          },
                        },
                      },
                      0,
                    ],
                  },
                  then: "Active",
                },
                {
                  case: {
                    $gt: [
                      {
                        $size: {
                          $filter: {
                            input: "$reservations",
                            as: "r",
                            cond: {
                              $and: [
                                { $eq: ["$$r.amountDue", 0] },
                                { $eq: ["$$r.completed", false] },
                              ],
                            },
                          },
                        },
                      },
                      0,
                    ],
                  },
                  then: "Pending",
                },
                {
                  case: {
                    $gt: [
                      {
                        $size: {
                          $filter: {
                            input: "$reservations",
                            as: "r",
                            cond: {
                              $and: [
                                { $gt: ["$$r.amountDue", 0] },
                                { $eq: ["$$r.completed", true] },
                              ],
                            },
                          },
                        },
                      },
                      0,
                    ],
                  },
                  then: "Delivered-unpaid",
                },
                {
                  case: {
                    $eq: [
                      { $size: "$reservations" },
                      {
                        $size: {
                          $filter: {
                            input: "$reservations",
                            as: "r",
                            cond: { $eq: ["$$r.completed", true] },
                          },
                        },
                      },
                    ],
                  },
                  then: "Completed",
                },
              ],
              default: "none",
            },
          },
        },
      },
      // Apply status/hideCompletedOnly filter
      ...(status !== "all" ? [{ $match: { orderStatus: status } }] : []),
      ...(hideCompletedOnly
        ? [{ $match: { orderStatus: { $ne: "Completed" } } }]
        : []),
      // Pagination
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limitNum },
    ];

    const clients = await Client.aggregate(pipeline);

    // Total count for pagination
    const countPipeline = [
      ...pipeline.filter((stage) => !stage.$skip && !stage.$limit),
      { $count: "totalCount" },
    ];
    const countResult = await Client.aggregate(countPipeline);
    const totalCount = countResult[0]?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / limitNum);

    // Aggregate all distinct tags across **all clients** (for filters in frontend)
    const tagsAggregation = await Client.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: null, allTags: { $addToSet: "$tags" } } },
    ]);
    const availableTags = tagsAggregation[0]?.allTags || [];

    res.json({
      clients,
      totalCount,
      totalPages,
      currentPage: pageNum,
      availableTags, 
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Failed to fetch clients", error: error.message });
  }
};

export const getAllTags = async (req, res) => {
  try {
    const tags = await Client.distinct("tags");
    res.status(200).json({ tags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createClient = async (req, res) => {
  try {
    const { name, phone, email, notes, user, tags = [] } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    // Prevent duplicates
    const existingClient = await Client.findOne({ phone });
    if (existingClient) {
      return res.status(400).json({ message: "Client with this phone already exists" });
    }

    const client = await Client.create({
      name,
      phone,
      email,
      notes,
      user,
      tags,
    });

    res.status(201).json(client);
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const client = await Client.findByIdAndUpdate(id, updates, { new: true });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client);
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByIdAndDelete(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
