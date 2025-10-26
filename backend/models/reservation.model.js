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
                name: String,
                quantity: Number,
                priceAtReservation: Number,
            },
        ],
        amountDue: {
            type: Number,
            required: true,
            default: 0,
        },
        dateOfDelivery: { type: Date, default: Date.now, required: true },
        completed: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;
