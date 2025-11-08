import Reservation from "../models/reservation.model.js";
import Client from "../models/client.model.js";
import mongoose from "mongoose";
import { getReservationStatus } from "../lib/statusHelper.js";

export const getAllReservations = async (req, res) => {
  try {
    const {
      search,
      category,
      products,
      statusFilter,
      sort = "deliveryDate",
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const matchStage = {};

    // Search by client name or phone
    if (search) {
      const matchingClients = await Client.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      }).select("_id");
      matchStage.client = { $in: matchingClients.map((c) => c._id) };
    }

    const productIds = products
      ? products.split(",").map((id) => new mongoose.Types.ObjectId(id))
      : [];

    // Aggregation pipeline
    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "clients",
          localField: "client",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: "$client" },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "populatedProducts",
        },
      },
      {
        $addFields: {
          products: {
            $map: {
              input: "$products",
              as: "p",
              in: {
                $mergeObjects: [
                  "$$p",
                  {
                    product: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$populatedProducts",
                            as: "popProd",
                            cond: { $eq: ["$$popProd._id", "$$p.product"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      { $project: { populatedProducts: 0 } },

      // Filter by category or product IDs if provided
      ...(category || productIds.length > 0
        ? [
            {
              $match: {
                products: {
                  $elemMatch: {
                    ...(category ? { "product.category": category } : {}),
                    ...(productIds.length > 0
                      ? { "product._id": { $in: productIds } }
                      : {}),
                  },
                },
              },
            },
          ]
        : []),

      // Sort
      {
        $sort:
          sort === "createdAt"
            ? { createdAt: -1 }
            : { dateOfDelivery: 1 }, // default
      },

      // Pagination
      { $skip: skip },
      { $limit: limitNum },
    ];

    let reservations = await Reservation.aggregate(pipeline);

    // Compute reservation status using helper
    reservations = reservations.map((r) => ({
      ...r,
      status: getReservationStatus(r),
    }));

    // Apply JS-level statusFilter if provided
    if (statusFilter) {
      reservations = reservations.filter((r) => r.status === statusFilter);
    }

    // Count total (without pagination)
    const totalCountPipeline = pipeline.filter(
      (stage) => !("$skip" in stage || "$limit" in stage)
    );

    let totalCountResult = await Reservation.aggregate(totalCountPipeline);
    totalCountResult = totalCountResult.map((r) => ({
      ...r,
      status: getReservationStatus(r),
    }));

    // Apply statusFilter to totalCount as well
    if (statusFilter) {
      totalCountResult = totalCountResult.filter((r) => r.status === statusFilter);
    }

    const totalCount = totalCountResult.length;
    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      reservations,
      currentPage: pageNum,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id)
      .populate("client", "name phone email")
      .populate("products.product", "name category pricePerKg");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error("Error fetching reservation by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createReservation = async (req, res) => {
  try {
    const {
      client,
      products,
      amountDue,
      dateOfDelivery,
      delivered = false,
      completed, // optional override
      notes,
    } = req.body;

    if (!client || !products?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const calculatedTotalAmount = products.reduce(
      (sum, p) => sum + (p.priceAtReservation * (p.quantityInGrams || 0)) / 1000,
      0
    );

    const numericAmountDue =
      amountDue === undefined || amountDue === null || amountDue === ""
        ? calculatedTotalAmount
        : Number(amountDue);

    const derivedCompleted =
      completed !== undefined
        ? completed
        : delivered && numericAmountDue === 0;

    const reservation = await Reservation.create({
      client,
      products,
      calculatedTotalAmount,
      amountDue: numericAmountDue,
      dateOfDelivery: dateOfDelivery || new Date(),
      delivered,
      completed: derivedCompleted,
      notes,
    });

    await reservation.populate([
      { path: "client", select: "name phone email" },
      { path: "products.product", select: "name category pricePerKg" },
    ]);

    res.status(201).json(reservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.products) {
      const calculatedTotalAmount = updates.products.reduce(
        (sum, p) => sum + (p.priceAtReservation * (p.quantityInGrams || 0)) / 1000,
        0
      );
      updates.calculatedTotalAmount = calculatedTotalAmount;

      if (updates.amountDue === undefined || updates.amountDue === null) {
        updates.amountDue = calculatedTotalAmount;
      }
    }

    if (typeof updates.delivered !== "undefined" || typeof updates.amountDue !== "undefined") {
      const reservation = await Reservation.findById(id);
      if (!reservation) return res.status(404).json({ message: "Reservation not found" });

      const delivered = updates.delivered ?? reservation.delivered;
      const amountDue = updates.amountDue ?? reservation.amountDue;
      updates.completed = delivered && amountDue === 0;
    }

    const reservation = await Reservation.findByIdAndUpdate(id, updates, {
      new: true,
    })
      .populate("client", "name phone email")
      .populate("products.product", "name category pricePerKg");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByIdAndDelete(id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
