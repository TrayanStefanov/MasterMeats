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

SpiceMixSchema.pre("save", async function (next) {
  const mix = this;

  let totalCost = 0;
  let totalGrams = 0;

  for (const ing of mix.ingredients) {
    const spice = await mongoose.model("Spice").findById(ing.spice);
    if (!spice) continue;

    const costPerGram = spice.costPerKg / 1000;
    totalCost += ing.grams * costPerGram;
    totalGrams += ing.grams;
  }

  mix.costPer100g = totalGrams
    ? Number(((totalCost / totalGrams) * 100).toFixed(2))
    : 0;

  next();
});



SpiceMixSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (!update.ingredients) return next();

  const Spice = mongoose.model("Spice");
  let totalCost = 0;
  let totalGrams = 0;

  for (const ing of update.ingredients) {
    const spice = await Spice.findById(ing.spice);
    if (!spice) continue;

    const costPerGram = spice.costPerKg / 1000;
    totalCost += ing.grams * costPerGram;
    totalGrams += ing.grams;
  }

  update.costPer100g = totalGrams
    ? Number(((totalCost / totalGrams) * 100).toFixed(2))
    : 0;

  next();
});


const SpiceMix = mongoose.model("SpiceMix", SpiceMixSchema);
export default SpiceMix;
