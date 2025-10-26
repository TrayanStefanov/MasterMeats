import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },
        reservationType: {
            type: String,
            enum: ["IRL", "Online"],
            default: "IRL",
        },
        products: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                quantity: { type: Number, required: true, min: 1 },
                priceAtReservation: { type: Number, required: true, min: 0 },
            },
        ],
        amountDue: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        dateOfDelivery: { type: Date, default: Date.now, required: true },
        completed: { type: Boolean, default: false },
        notes: { type: String, trim: true },
    },
    { timestamps: true }
);

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;
