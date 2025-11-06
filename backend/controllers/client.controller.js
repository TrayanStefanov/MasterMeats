import Client from "../models/client.model.js";
import Reservation from "../models/reservation.model.js";

export const getAllClients = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, sort = "createdAt", tags } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by tags
    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim());
      filter.tags = { $in: tagList };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await Client.countDocuments(filter);
    const clients = await Client.find(filter)
      .sort({ [sort]: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Enrich each client with reservation stats
    const enrichedClients = await Promise.all(
      clients.map(async (client) => {
        const reservations = await Reservation.find({ client: client._id })
          .populate("products.product", "name category pricePerKg")
          .sort({ dateOfDelivery: -1 })
          .lean();

        const totalOrders = reservations.length;
        const totalMeat = reservations.reduce(
          (sum, r) =>
            sum +
            r.products.reduce(
              (sub, p) => sub + (p.quantityInGrams || 0),
              0
            ),
          0
        );

        const totalPaid = reservations
          .filter((r) => r.completed)
          .reduce((sum, r) => sum + (r.calculatedTotalAmmount || 0), 0);

        const lastOrder = reservations[0] || null;

        return {
          ...client,
          totalOrders,
          totalMeat,
          totalPaid,
          lastOrder,
          reservations: reservations.map((r) => ({
            _id: r._id,
            dateOfDelivery: r.dateOfDelivery,
            completed: r.completed,
            calculatedTotalAmmount: r.calculatedTotalAmmount,
            products: r.products,
            notes: r.notes,
          })),
        };
      })
    );

    res.status(200).json({
      clients: enrichedClients,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
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

