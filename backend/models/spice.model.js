import mongoose from "mongoose";

const SpiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    costPerKg: {
      type: Number,
      required: true,
      min: 0,
    },
    stockInGrams: {
      type: Number,
      default: 0,
      min: 0,
    },
    supplier: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const Spice = mongoose.model("Spice", SpiceSchema);
export default Spice;
