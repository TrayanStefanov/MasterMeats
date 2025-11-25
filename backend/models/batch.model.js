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
  amountKg: { type: Number, required: true },
  pricePerKg: { type: Number, required: true },
  timeTaken: { type: Number, default: 0 },
});

/** Prepping Phase */
const PreppingPhaseSchema = new Schema({
  wasteKg: { type: Number, default: 0 },
  cookingCutsKg: { type: Number, default: 0 },
  timeTaken: { type: Number, default: 0 },
});

/** Curing Phase */
const CuringPhaseSchema = new Schema({
  saltName: { type: String },
  saltAmountKg: { type: Number, default: 0 },
  timeInSaltHours: { type: Number, default: 0 },
  liquidType: { type: String, default: null },
  timeInLiquidHours: { type: Number, default: 0 },
  rinseTime: { type: Number, default: 0 },
  timeTaken: { type: Number, default: 0 },
});

/** Seasoning Entry (per spice/spiceMix) */
const SeasoningEntrySchema = new Schema({
  spiceId: { type: Schema.Types.ObjectId, ref: "Spice" },
  spiceMixId: { type: Schema.Types.ObjectId, ref: "SpiceMix" },
  cuts: { type: Number, required: true },
  spiceAmountUsed: { type: Number, required: true },
  rackPositions: [{ type: String }],
});
/**
 * Only validate entries that actually contain data.
 * Prevents failing on empty objects that come from merging or defaults.
 */
SeasoningEntrySchema.pre("validate", function (next) {
  const hasSpice = this.spiceId || this.spiceMixId;

  // If cuts or spiceAmountUsed are present, then spiceId/spiceMixId is required
  const meaningfulEntry = this.cuts || this.spiceAmountUsed;

  if (meaningfulEntry && !hasSpice) {
    return next(
      new Error("Seasoning entry must have either a spiceId or spiceMixId")
    );
  }

  next();
});

const SeasoningPhaseSchema = new Schema({
  entries: { type: [SeasoningEntrySchema], default: [] },
  timeTaken: { type: Number, default: 0 }, 
  paperTowelCost: { type: Number, default: 0 }, 
});

/** Vacuum Phase **/
const VacuumEntrySchema = new Schema({
  spiceName: { type: String, required: true },
  originalSlices: { type: Number, required: true },
  rackPositions: [{ type: String }],
  vacuumedSlices: { type: Number, required: true },
  driedKg: { type: Number, required: true },
});

const VacuumPhaseSchema = new Schema({
  entries: { type: [VacuumEntrySchema], default: [] },
  timeTaken: { type: Number, default: 0 }, 
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
        timeTaken: 0,
        paperTowelCost: 0,
      }),
    },

    /** Same fix for Vacuum Phase */
    vacuumPhase: {
      type: VacuumPhaseSchema,
      default: () => ({
        entries: [], // prevents [{}] being created
        timeTaken: 0,
        vacuumRollCost: 0,
      }),
    },

    totalWorkTime: { type: Number, default: 0 },
    totalElapsedTimeHours: { type: Number, default: 0 },

    totalCost: { type: Number, default: 0 },
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

  if (this.sourcingPhase) totalWork += this.sourcingPhase.timeTaken || 0;
  if (this.preppingPhase) totalWork += this.preppingPhase.timeTaken || 0;
  if (this.curingPhase) totalWork += this.curingPhase.timeTaken || 0;
  if (this.seasoningPhase) totalWork += this.seasoningPhase.timeTaken || 0;
  if (this.vacuumPhase) totalWork += this.vacuumPhase.timeTaken || 0;

  this.totalWorkTime = totalWork;

  // Cost
  if (this.sourcingPhase)
    totalCost += this.sourcingPhase.amountKg * this.sourcingPhase.pricePerKg;
  if (this.seasoningPhase) totalCost += this.seasoningPhase.paperTowelCost || 0;
  if (this.vacuumPhase) totalCost += this.vacuumPhase.vacuumRollCost || 0;

  this.totalCost = totalCost;

  // Elapsed time
  if (this.startTime && this.finishTime)
    this.totalElapsedTimeHours =
      (this.finishTime - this.startTime) / (1000 * 60 * 60);

  const driedTotal = (this.vacuumPhase?.entries || []).reduce(
    (sum, v) => sum + (v.driedKg || 0),
    0
  );
  this.costPerKgDried = driedTotal > 0 ? totalCost / driedTotal : 0;

  next();
});

const Batch = mongoose.model("Batch", BatchSchema);
export default Batch;
