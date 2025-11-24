import mongoose from "mongoose";
const { Schema } = mongoose;

/* SUB-SCHEMAS */

/** Sourcing Phase */
const SourcingPhaseSchema = new Schema({
  meatType: { type: String, required: true },
  meatCutType: { type: String, required: true },   // NEW
  supplier: { type: String, required: true },
  amountKg: { type: Number, required: true },
  pricePerKg: { type: Number, required: true },
  timeTaken: { type: Number, default: 0 }
});

/** Prepping Phase */
const PreppingPhaseSchema = new Schema({
  meatType: { type: String, required: true },
  rawKg: { type: Number, required: true },
  wasteKg: { type: Number, default: 0 },
  cookingCutsKg: { type: Number, default: 0 },
  timeTaken: { type: Number, default: 0 }
});

/** Curing Phase */
const CuringPhaseSchema = new Schema({
  saltName: { type: String },
  saltAmountKg: { type: Number, default: 0 },
  saltTimeHours: { type: Number, default: 0 },

  liquidType: { type: String, default: null },       // wine, water, marinade
  liquidTimeHours: { type: Number, default: 0 },

  rinseTime: { type: Number, default: 0 },
  timeTaken: { type: Number, default: 0 }
});

/** Seasoning Phase — supports SPICE or MIX */
const SeasoningEntrySchema = new Schema({
  spiceId: { type: Schema.Types.ObjectId, ref: "Spice" },
  spiceMixId: { type: Schema.Types.ObjectId, ref: "SpiceMix" },

  cuts: { type: Number, required: true },           
  spiceAmountUsed: { type: Number, required: true },  

  rackPositions: [{ type: String }],

  timeTaken: { type: Number, default: 0 }
});

/** Enforce: Each seasoning entry MUST have spiceId OR spiceMixId */
SeasoningEntrySchema.pre("validate", function (next) {
  if (!this.spiceId && !this.spiceMixId) {
    return next(new Error("Seasoning entry must have either a spiceId or a spiceMixId"));
  }
  next();
});

/** Vacuum Phase **/
const VacuumEntrySchema = new Schema({
  spiceId: { type: Schema.Types.ObjectId, ref: "Spice" },
  spiceMixId: { type: Schema.Types.ObjectId, ref: "SpiceMix" },

  cuts: { type: Number, required: true },
  driedKg: { type: Number, required: true },

  vacuumRollPricePerKg: { type: Number, default: 0 },
  timeTaken: { type: Number, default: 0 }
});

/** Enforce: spice OR mix **/
VacuumEntrySchema.pre("validate", function (next) {
  if (!this.spiceId && !this.spiceMixId) {
    return next(new Error("Vacuum entry must have either a spiceId or a spiceMixId"));
  }
  next();
});

/* MAIN BATCH SCHEMA */

const BatchSchema = new Schema({
  batchNumber: { type: Number, unique: true },

  startTime: { type: Date },
  finishTime: { type: Date },

  sourcingPhase: { type: SourcingPhaseSchema, default: null },
  preppingPhase: { type: PreppingPhaseSchema, default: null },
  curingPhase: { type: CuringPhaseSchema, default: null },

  seasoningPhase: { type: [SeasoningEntrySchema], default: [] },
  vacuumPhase: { type: [VacuumEntrySchema], default: [] },

  totalWorkTime: { type: Number, default: 0 },
  totalElapsedTimeHours: { type: Number, default: 0 },

  totalCost: { type: Number, default: 0 },
  costPerKgDried: { type: Number, default: 0 }

}, { timestamps: true });

/* -------------------------- AUTO-INCREMENT BATCH # -------------------------- */

BatchSchema.pre("save", async function (next) {
  if (!this.batchNumber) {
    const Counter = mongoose.model("Counter", new Schema({
      name: String,
      value: Number
    }));

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

  // Work time
  if (this.sourcingPhase) totalWork += this.sourcingPhase.timeTaken || 0;
  if (this.preppingPhase) totalWork += this.preppingPhase.timeTaken || 0;
  if (this.curingPhase) totalWork += this.curingPhase.timeTaken || 0;

  this.seasoningPhase.forEach(s => totalWork += s.timeTaken || 0);
  this.vacuumPhase.forEach(v => totalWork += v.timeTaken || 0);

  this.totalWorkTime = totalWork;

  // Cost
  if (this.sourcingPhase) {
    totalCost += this.sourcingPhase.amountKg * this.sourcingPhase.pricePerKg;
  }

  // Vacuum roll cost
  this.vacuumPhase.forEach(v => {
    totalCost += v.driedKg * (v.vacuumRollPricePerKg || 0);
  });

  this.totalCost = totalCost;

  // Elapsed time
  if (this.startTime && this.finishTime) {
    const ms = this.finishTime - this.startTime;
    this.totalElapsedTimeHours = ms / (1000 * 60 * 60);
  }

  // Cost per dried kg
  const driedTotal = this.vacuumPhase.reduce((sum, v) => sum + v.driedKg, 0);
  this.costPerKgDried = driedTotal > 0 ? totalCost / driedTotal : 0;

  next();
});

const Batch = mongoose.model("Batch", BatchSchema);
export default Batch;
