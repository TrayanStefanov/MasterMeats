import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
  spice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Spice",
    required: true,
  },
  grams: {
    type: Number,
    required: true,
    min: 0.1,
  },
});

const SpiceMixSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    ingredients: [IngredientSchema],

    costPer100g: {
      type: Number,
      default: 0,
    },

    stockInGrams: {
      type: Number,
      default: 0,
      min: 0,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const SpiceMix = mongoose.model("SpiceMix", SpiceMixSchema);
export default SpiceMix;
