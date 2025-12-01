import mongoose from "mongoose";
const { Schema } = mongoose;

const CounterSchema = new Schema({
  name: String,
  value: Number,
});
const Counter =
  mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

/* SUB-SCHEMAS */

/** Sourcing Phase */
const SourcingPhaseSchema = new Schema({
  meatType: { type: String, required: true },
  meatCutType: { type: String, required: true },
  supplier: { type: String, required: true },
  amountInGrams: { type: Number, required: true },
  pricePerKg: { type: Number, required: true },
  workTimeMinutes: { type: Number, default: 0 },
});

/** Prepping Phase */
const PreppingPhaseSchema = new Schema({
  wasteInGrams: { type: Number, default: 0 },
  cookingCutsInGrams: { type: Number, default: 0 },
  workTimeMinutes: { type: Number, default: 0 },
});

/** Curing Phase */
const CuringPhaseSchema = new Schema({
  saltName: { type: String },
  saltAmountInGrams: { type: Number, default: 0 },
  saltCostPerKg: { type: Number, default: 0 },
  timeInSaltMinutes: { type: Number, default: 0 },
  liquidType: { type: String, default: null },
  timeInLiquidMinutes: { type: Number, default: 0 },
  workTimeMinutes: { type: Number, default: 0 },
});

/** Seasoning Entry (per spice/spiceMix) */
const SeasoningEntrySchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", default: null },
  spiceId: { type: Schema.Types.ObjectId, ref: "Spice" },
  spiceMixId: { type: Schema.Types.ObjectId, ref: "SpiceMix" },
  cuts: { type: Number, required: true },
  spiceAmountUsedInGrams: { type: Number, required: true },
  rackPositions: [{ type: String }],
});
/**
 * Only validate entries that actually contain data.
 * Prevents failing on empty objects that come from merging or defaults.
 */
SeasoningEntrySchema.pre("validate", function (next) {
  const hasSpice = this.spiceId || this.spiceMixId;

  // If cuts or spiceAmountUsed are present, then spiceId/spiceMixId is required
  const meaningfulEntry = this.cuts || this.spiceAmountUsedInGrams;

  if (meaningfulEntry && !hasSpice) {
    return next(
      new Error("Seasoning entry must have either a spiceId or spiceMixId")
    );
  }

  next();
});

const SeasoningPhaseSchema = new Schema({
  entries: { type: [SeasoningEntrySchema], default: [] },
  workTimeMinutes: { type: Number, default: 0 },
  paperTowelCost: { type: Number, default: 0 },
});

/** Vacuum Phase **/
const VacuumEntrySchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", default: null },
  spiceName: { type: String, required: true },
  originalSlices: { type: Number, required: true },
  rackPositions: [{ type: String }],
  vacuumedSlices: { type: Number, required: true },
  driedInGrams: { type: Number, required: true },
  timeDriedMinutes: { type: Number, default: 0 },
});

const VacuumPhaseSchema = new Schema({
  entries: { type: [VacuumEntrySchema], default: [] },
  workTimeMinutes: { type: Number, default: 0 },
  vacuumRollCost: { type: Number, default: 0 },
});

/*  MAIN BATCH SCHEMA */
const BatchSchema = new Schema(
  {
    batchNumber: { type: Number, unique: true },
    startTime: { type: Date },
    finishTime: { type: Date },

    sourcingPhase: { type: SourcingPhaseSchema, default: null },
    preppingPhase: { type: PreppingPhaseSchema, default: null },
    curingPhase: { type: CuringPhaseSchema, default: null },
    /** Seasoning Phase must always initialize with valid empty values */
    seasoningPhase: {
      type: SeasoningPhaseSchema,
      default: () => ({
        entries: [], // prevent Mongoose from creating [{}]
        workTimeMinutes: 0,
        paperTowelCost: 0,
      }),
    },

    /** Same fix for Vacuum Phase */
    vacuumPhase: {
      type: VacuumPhaseSchema,
      default: () => ({
        entries: [], // prevents [{}] being created
        workTimeMinutes: 0,
        vacuumRollCost: 0,
      }),
    },

    totalWorkTime: { type: Number, default: 0 },
    totalElapsedTimeHours: { type: Number, default: 0 },

    totalCost: { type: Number, default: 0 },
    driedTotalInGrams: { type: Number, default: 0 },
    costPerKgDried: { type: Number, default: 0 },
  },
  { timestamps: true }
);


/* AUTO-INCREMENT BATCH #  */

BatchSchema.pre("save", async function (next) {
  if (!this.batchNumber) {
    const counter = await Counter.findOneAndUpdate(
      { name: "batchNumber" },
      { $inc: { value: 1 } },
      { upsert: true, new: true }
    );
    this.batchNumber = counter.value;
  }
  next();
});

/* AUTO-CALCULATIONS */

BatchSchema.pre("save", function (next) {
  let totalWork = 0;
  let totalCost = 0;

  if (this.sourcingPhase) totalWork += this.sourcingPhase.workTimeMinutes || 0;
  if (this.preppingPhase) totalWork += this.preppingPhase.workTimeMinutes || 0;
  if (this.curingPhase) totalWork += this.curingPhase.workTimeMinutes || 0;
  if (this.seasoningPhase) totalWork += this.seasoningPhase.workTimeMinutes || 0;
  if (this.vacuumPhase) totalWork += this.vacuumPhase.workTimeMinutes || 0;

  this.totalWorkTime = totalWork;

  // Cost
  if (this.sourcingPhase)
    totalCost += (this.sourcingPhase.amountInGrams / 1000) * this.sourcingPhase.pricePerKg;
  if (this.seasoningPhase) totalCost += this.seasoningPhase.paperTowelCost || 0;
  if (this.vacuumPhase) totalCost += this.vacuumPhase.vacuumRollCost || 0;

  this.totalCost = totalCost;

  // Elapsed time
  if (this.startTime && this.finishTime)
    this.totalElapsedTimeHours =
      (this.finishTime - this.startTime) / (1000 * 60 * 60);

  // Dried total
  this.driedTotalInGrams = (this.vacuumPhase?.entries || []).reduce(
    (sum, v) => sum + (v.driedInGrams || 0),
    0
  );
  this.costPerKgDried = this.driedTotalInGrams > 0 ? totalCost / (this.driedTotalInGrams/1000) : 0;

  next();
});

const Batch = mongoose.model("Batch", BatchSchema);
export default Batch;
