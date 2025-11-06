import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        email: { type: String },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // If there is a user.
        notes: { type: String },
        tags: [{ type: String, trim: true }],
    },
    { timestamps: true }
);
clientSchema.index({ name: 1 });

const Client = mongoose.model("Client", clientSchema);
export default Client;