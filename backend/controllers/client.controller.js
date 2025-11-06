import Client from "../models/client.model.js";
import Reservation from "../models/reservation.model.js";

export const getAllClients = async (req, res) => {
  try {
    const {
      search,
      page = 1,
      limit = 10,
      tags,
      status, // "completed" | "pending"
      dateRange, // "today" | "tomorrow" | "week"
    } = req.query;

    const filter = {};

    // Global fuzzy search across multiple fields
    if (search) {
      const searchRegex = new RegExp(search, "i"); // case-insensitive partial
      filter.$or = [
        { name: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
        { tags: { $elemMatch: { $regex: search, $options: "i" } } },
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
    const clients = await Client.find(filter).lean();

    // Define date filters
    const now = new Date();
    let start, end;
    if (dateRange === "today") {
      start = new Date(now.setHours(0, 0, 0, 0));
      end = new Date(now.setHours(23, 59, 59, 999));
    } else if (dateRange === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      start = new Date(tomorrow.setHours(0, 0, 0, 0));
      end = new Date(tomorrow.setHours(23, 59, 59, 999));
    } else if (dateRange === "week") {
      const weekEnd = new Date();
      weekEnd.setDate(now.getDate() + 7);
      start = new Date(now.setHours(0, 0, 0, 0));
      end = new Date(weekEnd.setHours(23, 59, 59, 999));
    }

    // Enrich each client with reservation stats
    const enrichedClients = await Promise.all(
      clients.map(async (client) => {
        const reservationFilter = { client: client._id };
        if (status === "completed") reservationFilter.completed = true;
        if (status === "pending") reservationFilter.completed = false;
        if (dateRange) reservationFilter.dateOfDelivery = { $gte: start, $lte: end };

        const reservations = await Reservation.find(reservationFilter)
          .populate("products.product", "name category pricePerKg")
          .sort({ dateOfDelivery: 1 }) // ascending
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

        // Find closest upcoming or latest past delivery
        const today = new Date().setHours(0, 0, 0, 0);
        let closestReservation = null;

        const future = reservations.filter(
          (r) => new Date(r.dateOfDelivery).setHours(0, 0, 0, 0) >= today
        );

        if (future.length > 0) {
          closestReservation = future.reduce((a, b) =>
            new Date(a.dateOfDelivery) < new Date(b.dateOfDelivery) ? a : b
          );
        } else if (reservations.length > 0) {
          closestReservation = reservations.reduce((a, b) =>
            new Date(a.dateOfDelivery) > new Date(b.dateOfDelivery) ? a : b
          );
        }

        return {
          ...client,
          totalOrders,
          totalMeat,
          totalPaid,
          closestReservation,
          lastOrderDate: closestReservation?.dateOfDelivery || null,
          reservations: reservations
            .slice()
            .sort((a, b) => new Date(b.dateOfDelivery) - new Date(a.dateOfDelivery))
            .map((r) => ({
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

    // Sort clients by most urgent delivery (soonest delivery date first)
    const sortedClients = enrichedClients.sort((a, b) => {
      const aDate = a.lastOrderDate ? new Date(a.lastOrderDate) : null;
      const bDate = b.lastOrderDate ? new Date(b.lastOrderDate) : null;
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return aDate - bDate; // earliest first
    });

    const paginatedClients = sortedClients.slice(skip, skip + limitNum);

    res.status(200).json({
      clients: paginatedClients,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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

