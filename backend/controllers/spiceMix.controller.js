import SpiceMix from "../models/spiceMix.model.js";
import Spice from "../models/spice.model.js";

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return [...new Set(tags.map((t) => t.trim()).filter(Boolean))];
}

export const createSpiceMix = async (req, res) => {
  try {
    if (req.body.tags) req.body.tags = normalizeTags(req.body.tags);

    const mix = await SpiceMix.create(req.body);

    const populated = await mix.populate("ingredients.spice", "name costPerKg");

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getSpiceMixes = async (req, res) => {
  try {
    const { search, isActive, tags } = req.query;

    const query = {};

    // Name search
    if (search) {
      query.name = { $regex: search, $options: "i" }; // case-insensitive
    }

    // Status filter
    if (isActive !== undefined) {
      if (isActive === "true") query.isActive = true;
      else if (isActive === "false") query.isActive = false;
    }

    // Tags filter (comma-separated)
    if (tags) {
      const tagArray = tags.split(",").map((t) => t.trim()).filter(Boolean);
      if (tagArray.length) query.tags = { $all: tagArray }; // match all tags
    }

    const mixes = await SpiceMix.find(query)
      .populate("ingredients.spice", "name costPerKg")
      .sort({ name: 1 });

    res.status(200).json(mixes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const getAllTags = async (req, res) => {
  try {
    const tags = await SpiceMix.distinct("tags");
    res.status(200).json({ tags });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getSpiceMix = async (req, res) => {
  try {
    const mix = await SpiceMix.findById(req.params.id).populate(
      "ingredients.spice",
      "name costPerKg"
    );

    if (!mix) return res.status(404).json({ message: "Mix not found" });

    res.status(200).json(mix);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSpiceMix = async (req, res) => {
  try {
    if (req.body.tags) req.body.tags = normalizeTags(req.body.tags);

    const updated = await SpiceMix.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("ingredients.spice", "name costPerKg");

    if (!updated) return res.status(404).json({ message: "Mix not found" });

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const addStockToMix = async (req, res) => {
  const { id } = req.params;
  const { increaseBy } = req.body;

  if (!increaseBy || increaseBy <= 0) {
    return res.status(400).json({ message: "Invalid increase amount." });
  }

  try {
    const mix = await SpiceMix.findById(id).populate("ingredients.spice");

    if (!mix) return res.status(404).json({ message: "Mix not found" });

    const totalRecipeGrams = mix.ingredients.reduce(
      (sum, ing) => sum + ing.grams,
      0
    );

    const multiplier = increaseBy / totalRecipeGrams;

    // Start subtracting ingredient stocks
    for (const ing of mix.ingredients) {
      const subtractAmount = ing.grams * multiplier;

      const spice = await Spice.findById(ing.spice._id);
      if (!spice) continue;

      spice.stockInGrams = Math.max(0, spice.stockInGrams - subtractAmount);
      await spice.save();
    }

    // Add final mix stock
    mix.stockInGrams += increaseBy;
    await mix.save();

    res.json(mix);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update mix stock." });
  }
};

export const deleteSpiceMix = async (req, res) => {
  try {
    const mix = await SpiceMix.findById(req.params.id);
    if (!mix) return res.status(404).json({ message: "Mix not found" });

    await mix.deleteOne();

    res.status(200).json({ message: "Mix deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
