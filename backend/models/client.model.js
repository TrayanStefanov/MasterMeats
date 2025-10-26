import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // If there is a user.
        notes: { type: String },
    },
    { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);
export default Client;