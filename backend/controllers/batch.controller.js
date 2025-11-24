import Batch from "../models/batch.model.js";

export const createBatch = async (req, res) => {
  try {
    const batch = new Batch({
      ...req.body,
      startTime: new Date(), // auto set on first creation
    });

    await batch.save();

    res.status(201).json(batch);
  } catch (err) {
    console.error("[createBatch] Error creating batch:", err);
    res.status(500).json({ error: err.message || "Server Error" });
  }
};

export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    res.json(batches);
  } catch (err) {
    console.error("[getBatches] Error fetching batches:", err);
    res.status(500).json({ error: err.message || "Server Error" });
  }
};

export const getBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      console.warn(`[getBatch] Batch not found: ${req.params.id}`);
      return res.status(404).json({ error: "Batch not found" });
    }

    res.json(batch);
  } catch (err) {
    console.error(`[getBatch] Error fetching batch ${req.params.id}:`, err);
    res.status(500).json({ error: err.message || "Server Error" });
  }
};

export const updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!batch) {
      console.warn(`[updateBatch] Batch not found: ${req.params.id}`);
      return res.status(404).json({ error: "Batch not found" });
    }

    await batch.save(); // re-triggers pre-save totals recalculation

    res.json(batch);
  } catch (err) {
    console.error(`[updateBatch] Error updating batch ${req.params.id}:`, err);
    res.status(500).json({ error: err.message || "Server Error" });
  }
};

export const addSeasoningEntry = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      console.warn(`[addSeasoningEntry] Batch not found: ${req.params.id}`);
      return res.status(404).json({ error: "Batch not found" });
    }

    batch.seasoningPhase.push(req.body);
    await batch.save(); // auto recalculates totals

    res.json(batch);
  } catch (err) {
    console.error(
      `[addSeasoningEntry] Error adding seasoning entry to batch ${req.params.id}:`,
      err
    );
    res.status(500).json({ error: err.message || "Server Error" });
  }
};
export const addVacuumEntry = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      console.warn(`[addVacuumEntry] Batch not found: ${req.params.id}`);
      return res.status(404).json({ error: "Batch not found" });
    }

    batch.vacuumPhase.push(req.body);
    await batch.save(); // auto recalculates totals

    res.json(batch);
  } catch (err) {
    console.error(
      `[addVacuumEntry] Error adding vacuum entry to batch ${req.params.id}:`,
      err
    );
    res.status(500).json({ error: err.message || "Server Error" });
  }
};

export const finishBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      console.warn(`[finishBatch] Batch not found: ${req.params.id}`);
      return res.status(404).json({ error: "Batch not found" });
    }

    batch.finishTime = new Date();
    await batch.save(); // triggers elapsedTime + totals update

    res.json(batch);
  } catch (err) {
    console.error(`[finishBatch] Error finishing batch ${req.params.id}:`, err);
    res.status(500).json({ error: err.message || "Server Error" });
  }
};

export const deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);

    if (!batch) {
      console.warn(`[deleteBatch] Batch not found: ${req.params.id}`);
      return res.status(404).json({ error: "Batch not found" });
    }

    res.json({ message: "Batch deleted", batch });
  } catch (err) {
    console.error(`[deleteBatch] Error deleting batch ${req.params.id}:`, err);
    res.status(500).json({ error: err.message || "Server Error" });
  }
};
