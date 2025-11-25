import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaSave } from "react-icons/fa";
import { useBatchStore } from "../stores/useBatchStore";

import PhaseSourcing from "./PhaseSourcing";
import PhasePrepping from "./PhasePrepping";
import PhaseCuring from "./PhaseCuring";
import PhaseSeasoning from "./PhaseSeasoning";
import PhaseVacuum from "./PhaseVacuumSealing";
import Stepper from "./PhasesStepper";

const PHASE_KEYS = ["sourcing", "prepping", "curing", "seasoning", "vacuum"];
const PHASE_LABELS = [
  "Sourcing",
  "Prepping",
  "Curing",
  "Seasoning",
  "Vacuum Sealing",
];
const ADDITIVE_PHASES = ["seasoning", "vacuum"];

const REQUIRED_FIELDS = {
  sourcing: ["meatType", "meatCutType", "supplier", "amountKg", "pricePerKg"],
  prepping: [],
  curing: [],
  seasoning: [],
  vacuum: [],
};

const BatchCreate = ({ editBatch, onFinish }) => {
  const { createBatch, updatePhase, addPhaseEntry, currentBatch, loading } =
    useBatchStore();

  const [step, setStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [phases, setPhases] = useState({
    sourcing: {
      meatType: "",
      meatCutType: "",
      supplier: "",
      amountKg: "",
      pricePerKg: "",
      timeTaken: "",
    },
    prepping: { wasteKg: "", cookingCutsKg: "", timeTaken: "" },
    curing: {
      saltName: "",
      saltAmountKg: "",
      timeInSaltHours: "",
      liquidType: "",
      timeInLiquidHours: "",
      rinseTime: "",
      timeTaken: "",
    },
    seasoning: { entries: [], timeTaken: "", paperTowelCost: "" },
    vacuum: { entries: [], timeTaken: "", vacuumRollCost: "" },
  });

  const phaseComponents = [
    <PhaseSourcing
      data={phases.sourcing}
      onChange={(v) => setPhases((p) => ({ ...p, sourcing: v }))}
    />,
    <PhasePrepping
      data={phases.prepping}
      onChange={(v) => setPhases((p) => ({ ...p, prepping: v }))}
    />,
    <PhaseCuring
      data={phases.curing}
      onChange={(v) => setPhases((p) => ({ ...p, curing: v }))}
    />,
    <PhaseSeasoning
      data={phases.seasoning}
      onChange={(v) => setPhases((p) => ({ ...p, seasoning: v }))}
    />,
    <PhaseVacuum
      data={phases.vacuum}
      onChange={(v) => setPhases((p) => ({ ...p, vacuum: v }))}
      previousPhaseEntries={phases.seasoning.entries}
    />,
  ];

  // ---------------- Helpers ----------------
  const sanitize = (data) =>
    Object.fromEntries(
      Object.entries(data).map(([k, v]) => [
        k,
        v === "" ? 0 : !isNaN(v) ? Number(v) : v,
      ])
    );

  const validatePhase = (phaseKey, data) => {
    const required = REQUIRED_FIELDS[phaseKey];
    const missing = required.filter(
      (f) => data[f] === "" || data[f] === null || data[f] === undefined
    );
    return missing.length > 0 ? missing : null;
  };

  const sanitizeSeasoningEntries = (entries) =>
    entries.map((entry) => ({
      cuts: Number(entry.cuts) || 0,
      spiceAmountUsed: Number(entry.spiceAmountUsed) || 0,
      spiceId: entry.spiceId ? entry.spiceId.toString().trim() : null,
      spiceMixId: entry.spiceMixId ? entry.spiceMixId.toString().trim() : null,
      rackPositions: Array.isArray(entry.rackPositions)
        ? entry.rackPositions
        : [],
    }));

  const validateSeasoningEntries = (entries) => {
    const errors = [];
    entries.forEach((entry, i) => {
      if (!entry.spiceId && !entry.spiceMixId)
        errors.push(`Entry ${i + 1}: Must select a spice or mix`);
      if (!entry.cuts || entry.cuts <= 0)
        errors.push(`Entry ${i + 1}: Must have valid cuts`);
      if (!entry.spiceAmountUsed || entry.spiceAmountUsed <= 0)
        errors.push(`Entry ${i + 1}: Must enter spice amount used`);
    });
    return errors.length > 0 ? errors : null;
  };

  const submitPhase = async ({
    advanceStep = true,
    returnToList = false,
  } = {}) => {
    const phaseKey = PHASE_KEYS[step];
    setErrorMsg("");

    try {
      let phaseData = ADDITIVE_PHASES.includes(phaseKey)
        ? { ...phases[phaseKey] }
        : sanitize(phases[phaseKey]);

      // Seasoning
      if (phaseKey === "seasoning") {
        if (!currentBatch) {
          setErrorMsg("You must complete Sourcing first");
          return;
        }

        const entries = sanitizeSeasoningEntries(phaseData.entries || []);
        const errors = validateSeasoningEntries(entries);
        if (errors) {
          setErrorMsg(errors.join(", "));
          return;
        }
        phaseData.entries = entries;

        if (entries.length > 0) {
          await addPhaseEntry(currentBatch._id, "seasoning", {
            entries,
            timeTaken: Number(phaseData.timeTaken),
            paperTowelCost: Number(phaseData.paperTowelCost),
          });
        }
      }

      else if (ADDITIVE_PHASES.includes(phaseKey)) {
        await addPhaseEntry(currentBatch._id, phaseKey, {
          entries: phaseData.entries || [],
          timeTaken: Number(phaseData.timeTaken || 0),
          ...(phaseKey === "vacuum"
            ? { vacuumRollCost: Number(phaseData.vacuumRollCost || 0) }
            : { paperTowelCost: Number(phaseData.paperTowelCost || 0) }),
        });
      }
      
      else {
        const missingFields = validatePhase(phaseKey, phaseData);
        if (missingFields) {
          setErrorMsg(`Missing or invalid fields: ${missingFields.join(", ")}`);
          return;
        }

        if (!currentBatch && step === 0) {
          await createBatch({ sourcingPhase: sanitize(phases.sourcing) });
        } else {
          await updatePhase(currentBatch._id, phaseKey, phaseData);
        }
      }

      // Advance step if requested
      if (advanceStep && step < PHASE_KEYS.length - 1) setStep(step + 1);

      // If requested, return to batch list
      if (returnToList && typeof onFinish === "function") onFinish();
    } catch (err) {
      console.error(`Error submitting phase "${phaseKey}":`, err);
      setErrorMsg(err.message || "An error occurred while saving the phase.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full mx-auto flex flex-col gap-6"
    >
      <Stepper steps={PHASE_LABELS} current={step} />

      <div className="bg-base-200 rounded-xl p-6 shadow-md">
        {phaseComponents[step]}
      </div>

      {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}

      <div className="flex justify-between mt-4 gap-2">
        <button
          className="btn btn-accent"
          disabled={step === 0}
          onClick={() => setStep(step - 1)}
        >
          <FaArrowLeft /> Back
        </button>

        <div className="flex gap-2">
          <button
            className="btn btn-secondary"
            disabled={loading}
            onClick={() => submitPhase({ returnToList: true })}
          >
            <FaSave /> Save Phase
          </button>

          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={() => submitPhase()}
          >
            {step === PHASE_KEYS.length - 1 ? (
              <>
                <FaSave /> Finish Batch
              </>
            ) : (
              <>
                Next <FaArrowRight />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BatchCreate;
