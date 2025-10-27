import Stripe from "stripe";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// Create Payment Intent
export const createPaymentIntent = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("cartItems.product");

    if (!user || user.cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total amount in cents
    const amount = user.cartItems.reduce((sum, item) => {
      return sum + (item.product.pricePerKg * item.quantityInGrams) / 1000;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency: "eur",
      metadata: {
        userId: userId.toString(),
        products: JSON.stringify(
          user.cartItems.map((item) => ({
            id: item.product._id,
            quantityInGrams: item.quantityInGrams,
            pricePerKg: item.product.pricePerKg,
          }))
        ),
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating Payment Intent:", error);
    res.status(500).json({ error: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "Missing paymentIntentId" });
    }

    // Fetch PaymentIntent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return res.status(404).json({ error: "PaymentIntent not found" });
    }

    // Only create an order if the payment was successful
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    // Extract metadata
    const metadata = paymentIntent.metadata || {};
    const { userId } = metadata;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId in payment metadata" });
    }

    let products = [];
    try {
      products = JSON.parse(metadata.products || "[]");
    } catch (parseError) {
      console.error("Error parsing Stripe metadata products:", parseError);
      return res.status(400).json({ error: "Invalid product metadata" });
    }

    if (products.length === 0) {
      return res.status(400).json({ error: "No products found in metadata" });
    }

    // Prevent duplicate order creation
    const existingOrder = await Order.findOne({ stripeSessionId: paymentIntent.id });
    if (existingOrder) {
      return res.status(200).json({ success: true, orderId: existingOrder._id });
    }

    // Construct Order document
    const order = new Order({
      user: userId,
      products: products.map((p) => ({
        product: p.id,
        quantityInGrams: Math.max(1, Math.round(p.quantityInGrams)), 
        price: p.pricePerKg,
      })),
      totalAmount: paymentIntent.amount / 100, // convert cents → euros
      stripeSessionId: paymentIntent.id,
      status: "completed",
    });

    try {
      await order.save();
    } catch (saveError) {
      console.error("Order save failed:", saveError);
      return res.status(500).json({ error: "Failed to save order", details: saveError.message });
    }

    // Clear user's cart
    await User.findByIdAndUpdate(userId, { $set: { cartItems: [] } });

    console.log("Order created successfully:", order._id);
    res.status(200).json({ success: true, orderId: order._id });
  } catch (error) {
    console.error("Error in confirmPayment controller:", error);
    res.status(500).json({ error: error.message });
  }
};
