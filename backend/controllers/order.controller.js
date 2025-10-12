import Order from "../models/order.model.js";

export const getLastOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ user: req.user._id, status: "completed" })
      .sort({ createdAt: -1 })
      .populate("products.product");

    if (!order) {
      return res.status(404).json({ error: "No completed orders found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching last order:", error);
    res.status(500).json({ error: error.message });
  }
};