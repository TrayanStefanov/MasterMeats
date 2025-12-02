import mongoose from "mongoose";
import Batch from "../models/batch.model.js";
import Spice from "../models/spice.model.js";
import SpiceMix from "../models/spiceMix.model.js";
import Product from "../models/product.model.js";

/* --------------------------- HELPER --------------------------- */
const handleError = (res, context, err) => {
  console.error(`[${context}]`, err);
  res.status(500).json({ error: err.message || "Server Error" });
};

/* --------------------------- CREATE --------------------------- */
export const createBatch = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const batch = new Batch({
      ...req.body,
      startTime: new Date(),
    });
    await batch.save({ session });
    await session.commitTransaction();
    res.status(201).json(batch);
  } catch (err) {
    await session.abortTransaction();
    handleError(res, "createBatch", err);
  } finally {
    session.endSession();
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

/* --------------------------- UPDATE PHASES WITH STOCK ADJUSTMENT --------------------------- */
const updatePhaseObject = async (req, res, field) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    const prevEntries = batch[field]?.entries || [];
    const newEntries = req.body.entries || [];

    /* ---------------- SEASONING STOCK DEDUCTION ---------------- */
    if (field === "seasoningPhase") {
      for (let i = 0; i < newEntries.length; i++) {
        const prev = prevEntries[i] || {};
        const curr = newEntries[i];

        const prevAmount = Number(prev.spiceAmountUsedInGrams || 0);
        const currAmount = Number(curr.spiceAmountUsedInGrams || 0);
        const delta = currAmount - prevAmount;
        if (!delta) continue;

        if (curr.spiceId) {
          await Spice.findByIdAndUpdate(curr.spiceId, {
            $inc: { stockInGrams: -delta },
          });
        } else if (curr.spiceMixId) {
          await SpiceMix.findByIdAndUpdate(curr.spiceMixId, {
            $inc: { stockInGrams: -delta },
          });
        }
      }
    }

    /* ---------------- VACUUM → PRODUCT STOCK DEDUCTION ---------------- */
    if (field === "vacuumPhase") {
      for (let i = 0; i < newEntries.length; i++) {
        const prev = prevEntries[i] || {};
        const curr = newEntries[i];

        const prevDried = Number(prev.driedInGrams || 0);
        const currDried = Number(curr.driedInGrams || 0);
        const delta = currDried - prevDried;
        if (!delta) continue;

        // Spice or mix association from seasoning
        const spiceId = curr.spiceId;
        const mixId = curr.spiceMixId;

        console.log("request", req.body);
        let product;
        if (spiceId) {
          product = await Product.findOne({ defaultSpiceId: spiceId });
        } else if (mixId) {
          product = await Product.findOne({ defaultSpiceMixId: mixId });
        }

        if (product) {
          await Product.findByIdAndUpdate(product._id, {
            $inc: { stockInGrams: delta },
          });
        }
      }
    }

    /* ---------------- UPDATE PHASE DATA ---------------- */
    batch[field] = {
      ...(batch[field]?._doc || {}),
      ...req.body,
      entries: newEntries,
    };

    await batch.save();
    res.json(batch);
  } catch (err) {
    handleError(res, `updatePhaseObject(${field})`, err);
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
