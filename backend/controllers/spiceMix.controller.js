import SpiceMix from "../models/spiceMix.model.js";

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
    const mixes = await SpiceMix.find()
      .populate("ingredients.spice", "name costPerKg")
      .sort({ name: 1 });

    res.status(200).json(mixes);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
