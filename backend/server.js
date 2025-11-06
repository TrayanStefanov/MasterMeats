import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";
import productRoutes from "./routes/product.routes.js";
import localeRoutes from "./routes/locale.routes.js";

import reservationRoutes from "./routes/reservations.routes.js";
import clientRoutes from "./routes/client.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: process.env.CLIENT_URL, // allow requests from frontend
  credentials: true,             // allow cookies to be sent
}));

app.use(express.json({ limit: "10mb" })); // allows you to parse the body of the request
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/products", productRoutes);
app.use("/api/locales", localeRoutes);

app.use("/api/reservations", reservationRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/analytics", analyticsRoutes);

app.listen(PORT, () => {
	console.log("Server is running on http://localhost:" + PORT);
	connectDB();
});