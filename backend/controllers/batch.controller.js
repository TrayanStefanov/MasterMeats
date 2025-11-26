import Batch from "../models/batch.model.js";

/* --------------------------- HELPER --------------------------- */
const handleError = (res, context, err) => {
  console.error(`[${context}]`, err);
  res.status(500).json({ error: err.message || "Server Error" });
};

/* --------------------------- CREATE --------------------------- */
export const createBatch = async (req, res) => {
  try {
    const batch = new Batch({
      ...req.body,
      startTime: new Date(),
    });
    await batch.save();
    res.status(201).json(batch);
  } catch (err) {
    handleError(res, "createBatch", err);
  }
};

/* --------------------------- READ --------------------------- */
export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    res.json(batches);
  } catch (err) {
    handleError(res, "getBatches", err);
  }
};

export const getBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ error: "Batch not found" });
    res.json(batch);
  } catch (err) {
    handleError(res, `getBatch ${req.params.id}`, err);
  }
};

/* --------------------------- UPDATE --------------------------- */
/* export const updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!batch) return res.status(404).json({ error: "Batch not found" });
    res.json(batch);
  } catch (err) {
    handleError(res, `updateBatch ${req.params.id}`, err);
  }
}; */

/* --------------------- FULL PHASE UPDATE --------------------- */
const updatePhaseObject = async (req, res, field) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    // overwrite phase object, preserving unspecified fields
    batch[field] = {
      ...(batch[field]?._doc || {}), // preserve existing phase fields
      ...req.body,                  // overwrite with new values
      entries: req.body.entries ?? batch[field]?.entries ?? [],
      timeTaken: req.body.timeTaken ?? batch[field]?.timeTaken ?? 0,
      paperTowelCost:
        req.body.paperTowelCost ?? batch[field]?.paperTowelCost ?? 0,
      vacuumRollCost:
        req.body.vacuumRollCost ?? batch[field]?.vacuumRollCost ?? 0,
    };

    await batch.save();
    res.json(batch);
  } catch (err) {
    handleError(res, `updatePhaseObject ${field}`, err);
  }
};

export const updateSourcingPhase = (req, res) =>
  updatePhaseObject(req, res, "sourcingPhase");

export const updatePreppingPhase = (req, res) =>
  updatePhaseObject(req, res, "preppingPhase");

export const updateCuringPhase = (req, res) =>
  updatePhaseObject(req, res, "curingPhase");

export const updateSeasoningPhase = (req, res) =>
  updatePhaseObject(req, res, "seasoningPhase");

export const updateVacuumPhase = (req, res) =>
  updatePhaseObject(req, res, "vacuumPhase");

/* --------------------------- FINISH --------------------------- */
export const finishBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    batch.finishTime = new Date();
    await batch.save();
    res.json(batch);
  } catch (err) {
    handleError(res, `finishBatch ${req.params.id}`, err);
  }
};

/* --------------------------- DELETE --------------------------- */
export const deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    res.json({ message: "Batch deleted", batch });
  } catch (err) {
    handleError(res, `deleteBatch ${req.params.id}`, err);
  }
};
