import Reservation from "../models/reservation.model.js";
import Product from "../models/product.model.js";

export const getAllReservations = async (req, res) => {
  try {
    const {
      search, // client name or phone
      category,
      productName,
      completed,
      amountDue,
      sort, // deliveryDate, createdAt, etc.
      page = 1, // current page
      limit = 10, // results per page
    } = req.query;

    let filter = {};

    // Search by client name or phone
    if (search) {
      filter.$or = [
        { clientName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
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
      .populate({
        path: "orderId",
        populate: {
          path: "products.product",
          select: "name category pricePerKg",
        },
      })
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .exec();
    if (category || productName) {
      reservations = reservations.filter((res) =>
        res.orderId?.products?.some((p) => {
          const product = p.product || {};
          if (category && product.category !== category) return false;
          if (productName && product.name !== productName) return false;
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
    const reservation = await Reservation.findById(id).populate("orderId");

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
      clientName,
      phone,
      orderId,
      amountDue,
      dateOfDelivery,
      completed = false,
    } = req.body;

    if (!clientName || !phone || !orderId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const reservation = await Reservation.create({
      clientName,
      phone,
      orderId,
      amountDue,
      dateOfDelivery: dateOfDelivery || new Date(),
      completed,
    });

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

    const reservation = await Reservation.findByIdAndUpdate(id, updates, {
      new: true,
    });

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
