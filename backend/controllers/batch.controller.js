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
export const updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!batch) return res.status(404).json({ error: "Batch not found" });

    await batch.save();
    res.json(batch);
  } catch (err) {
    handleError(res, `updateBatch ${req.params.id}`, err);
  }
};

/* --------------------- PHASE FULL-OBJECT UPDATE --------------------- */
export const updateSourcingPhase = async (req, res) =>
  updatePhaseObject(req, res, "sourcingPhase");

export const updatePreppingPhase = async (req, res) =>
  updatePhaseObject(req, res, "preppingPhase");

export const updateCuringPhase = async (req, res) =>
  updatePhaseObject(req, res, "curingPhase");

export const updateSeasoningPhase = async (req, res) =>
  updatePhaseObject(req, res, "seasoningPhase");

export const updateVacuumPhase = async (req, res) =>
  updatePhaseObject(req, res, "vacuumPhase");

/** Replace/patch full phase object */
const updatePhaseObject = async (req, res, field) => {
  try {
    console.log("DEBUG: updatePhaseObject", req.params.id, field, req.body);
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    batch[field] = {
      // keep existing doc (ensures mongoose getters stay intact)
      ...(batch[field]?._doc || {}),

      /**
       * Ensure entries array always exists
       * If req.body omits entries, we KEEP the old array
       * If req.body includes entries, that overwrites intentionally
       */
      entries: req.body.entries ?? batch[field]?.entries ?? [],

      /**
       * Preserve phase-level fields unless overwritten
       * Works for both seasoningPhase + vacuumPhase
       */
      timeTaken: req.body.timeTaken ?? batch[field]?.timeTaken ?? 0,
      paperTowelCost:
        req.body.paperTowelCost ?? batch[field]?.paperTowelCost ?? 0,
      vacuumRollCost:
        req.body.vacuumRollCost ?? batch[field]?.vacuumRollCost ?? 0,

      // finally apply request body to override anything intentionally changed
      ...req.body,
    };

    await batch.save();
    res.json(batch);
  } catch (err) {
    handleError(res, `updatePhaseObject ${field}`, err);
  }
};

/* --------------------- ADD ENTRIES --------------------- */
export const addSeasoningEntry = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    if (!batch.seasoningPhase)
      batch.seasoningPhase = { entries: [], timeTaken: 0, paperTowelCost: 0 };

    // unwrap entries
    const entries = Array.isArray(req.body)
      ? req.body
      : Array.isArray(req.body.entries)
      ? req.body.entries
      : [req.body];

    // Add new entries
    batch.seasoningPhase.entries.push(...entries);

    // Merge top-level fields from req.body
    batch.seasoningPhase.timeTaken =
      req.body.timeTaken ?? batch.seasoningPhase.timeTaken ?? 0;
    batch.seasoningPhase.paperTowelCost =
      req.body.paperTowelCost ?? batch.seasoningPhase.paperTowelCost ?? 0;

    await batch.save();
    console.log("DEBUG: addSeasoningEntry", batch);
    res.json(batch);
  } catch (err) {
    handleError(res, `addSeasoningEntry ${req.params.id}`, err);
  }
};

/* ----------------------- ADD VACUUM ENTRIES ----------------------- */
export const addVacuumEntry = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    if (!batch.vacuumPhase)
      batch.vacuumPhase = { entries: [], timeTaken: 0, vacuumRollCost: 0 };

    // unwrap entries
    const entries = Array.isArray(req.body.entries)
      ? req.body.entries
      : Array.isArray(req.body)
      ? req.body
      : [req.body];

    batch.vacuumPhase.entries.push(...entries);

    // Update phase-level fields
    batch.vacuumPhase.timeTaken =
      req.body.timeTaken ?? batch.vacuumPhase.timeTaken;
    batch.vacuumPhase.vacuumRollCost =
      req.body.vacuumRollCost ?? batch.vacuumPhase.vacuumRollCost;

    await batch.save();
    res.json(batch);
  } catch (err) {
    handleError(res, `addVacuumEntry ${req.params.id}`, err);
  }
};

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
