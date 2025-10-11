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

// Handle successful payment webhook or frontend confirmation
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    const metadata = paymentIntent.metadata;
    const products = JSON.parse(metadata.products);

    const order = new Order({
      user: metadata.userId,
      products: products.map((p) => ({
        product: p.id,
        quantity: p.quantityInGrams,
        price: p.pricePerKg,
      })),
      totalAmount: paymentIntent.amount / 100,
      stripeSessionId: paymentIntent.id,
      status: "completed",
    });

    await order.save();

    // Clear user's cart
    await User.findByIdAndUpdate(metadata.userId, { cartItems: [] });

    res.status(200).json({ success: true, orderId: order._id });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ error: error.message });
  }
};
