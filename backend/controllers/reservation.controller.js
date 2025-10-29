import Reservation from "../models/reservation.model.js";
import Client from "../models/client.model.js";

export const getAllReservations = async (req, res) => {
  try {
    const {
      search, // client name or phone
      category,
      productId,
      completed,
      amountDue,
      sort, // deliveryDate, createdAt, etc.
      page = 1, // current page
      limit = 10, // results per page
    } = req.query;
    
    // Build the filter
    let filter = {};
    
    // Search by client name or phone
    if (search) {
      const matchingClients = await Client.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      }).select("_id");
      filter.client = { $in: matchingClients.map((c) => c._id) };
    }

    // Filter by completion
    if (completed !== undefined) {
      filter.completed = completed === "true";
    }

    // Filter by amount due
    if (amountDue === "none") {
      filter.amountDue = { $lte: 0 };
    } else if (amountDue === "some") {
      filter.amountDue = { $gt: 0 };
    }

    // Sorting options
    let sortOption = {};
    if (sort === "deliveryDate") sortOption = { dateOfDelivery: 1 };
    else if (sort === "createdAt") sortOption = { createdAt: -1 };

    // Convert page/limit to integers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Total count for pagination info
    const totalCount = await Reservation.countDocuments(filter);
    
    // Fetch paginated + filtered results
    let reservations = await Reservation.find(filter)
    .populate("client", "name phone email")
      .populate({
        path: "products.product",
        select: "name category pricePerKg",
      })
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .exec();
    if (category || productId) {
      reservations = reservations.filter((res) =>
        res.products?.some((p) => {
          const prod = p.product || {};
          if (category && prod.category !== category) return false;
          if (productId && prod._id.toString() !== productId) return false;
          return true;
        })
      );
    }

    // Pagination metadata
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
      .populate({
        path: "products.product",
        select: "name category pricePerKg",
      });

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
      completed = false,
      notes,
    } = req.body;


    if (!client || !products?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const calculatedTotalAmmount = products.reduce(
      (sum, p) => sum + (p.priceAtReservation * (p.quantityInGrams || 0)) / 1000,
      0
    );

    const numericAmountDue =
      amountDue === undefined || amountDue === null || amountDue === ""
        ? calculatedTotalAmmount
        : Number(amountDue);

    const reservation = await Reservation.create({
      client,
      products,
      calculatedTotalAmmount: calculatedTotalAmmount,
      amountDue: numericAmountDue,
      dateOfDelivery: dateOfDelivery || new Date(),
      completed,
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
      const calculatedTotalAmmount = updates.products.reduce(
        (sum, p) => sum + (p.priceAtReservation * (p.quantityInGrams || 0)) / 1000,
        0
      );

      updates.calculatedTotalAmmount = calculatedTotalAmmount;

      if (updates.amountDue === undefined || updates.amountDue === null) {
        updates.amountDue = calculatedTotalAmmount;
      }
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
