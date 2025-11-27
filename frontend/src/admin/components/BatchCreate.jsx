import { useState, useEffect } from "react";
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

const REQUIRED_FIELDS = {
  sourcing: ["meatType", "meatCutType", "supplier", "amountKg", "pricePerKg"],
  prepping: [],
  curing: [],
  seasoning: [],
  vacuum: [],
};

const BatchCreate = ({ editBatch, onFinish }) => {
  const {
    createBatch,
    updatePhase,
    finishBatch,
    currentBatch,
    setCurrentBatch,
    loading,
  } = useBatchStore();

  const [step, setStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const [phases, setPhases] = useState({
    sourcing: {
      meatType: "",
      meatCutType: "",
      supplier: "",
      amountKg: "",
      pricePerKg: "",
      workTimeMinutes: "",
    },
    prepping: { wasteKg: "", cookingCutsKg: "", workTimeMinutes: "" },
    curing: {
      saltName: "",
      saltAmountKg: "",
      saltCostPerKg: "",
      timeInSaltMinutes: "",
      liquidType: "",
      timeInLiquidMinutes: "",
      workTimeMinutes: "",
    },
    seasoning: { entries: [], workTimeMinutes: "", paperTowelCost: "" },
    vacuum: { entries: [], workTimeMinutes: "", vacuumRollCost: "" },
  });

  // ------------------ Prefill and set step ------------------
  useEffect(() => {
    if (!editBatch) return;
    const newPhases = { ...phases };
    PHASE_KEYS.forEach((key) => {
      const batchPhaseKey = `${key}Phase`;
      if (editBatch[batchPhaseKey]) {
        newPhases[key] = {
          ...editBatch[batchPhaseKey],
          entries: editBatch[batchPhaseKey]?.entries || [],
        };
      }
    });
    setPhases(newPhases);
    setCurrentBatch(editBatch);

    // Determine first incomplete phase
    let nextStep = 0;
    for (let i = 0; i < PHASE_KEYS.length; i++) {
      const key = PHASE_KEYS[i];
      const data = newPhases[key];
      const required = REQUIRED_FIELDS[key] || [];
      const incomplete = required.some(
        (f) => data[f] === "" || data[f] === null || data[f] === undefined
      );
      if (
        incomplete ||
        (["seasoning", "vacuum"].includes(key) &&
          (!data.entries || data.entries.length === 0))
      ) {
        nextStep = i;
        break;
      }
    }
    setStep(nextStep);
  }, [editBatch]);

  // ------------------ Helpers ------------------
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

  const sanitizeEntries = (phaseKey, entries) => {
    if (!entries || !entries.length) return [];
    return entries
      .map((entry) => {
        if (phaseKey === "seasoning") {
          return {
            cuts: Number(entry.cuts) || 0,
            spiceAmountUsed: Number(entry.spiceAmountUsed) || 0,
            spiceId: entry.spiceId ? entry.spiceId.toString().trim() : null,
            spiceMixId: entry.spiceMixId
              ? entry.spiceMixId.toString().trim()
              : null,
            rackPositions: Array.isArray(entry.rackPositions)
              ? entry.rackPositions
              : [],
          };
        }
        if (phaseKey === "vacuum") {
          return {
            ...entry,
            vacuumedSlices: Number(entry.vacuumedSlices) || 0,
            driedKg: Number(entry.driedKg) || 0,
            rackPositions: Array.isArray(entry.rackPositions)
              ? entry.rackPositions
              : [],
          };
        }
        return entry;
      })
      .filter((entry) => {
        if (phaseKey === "seasoning")
          return (
            (entry.spiceId || entry.spiceMixId) &&
            entry.cuts > 0 &&
            entry.spiceAmountUsed > 0
          );
        if (phaseKey === "vacuum")
          return entry.vacuumedSlices > 0 || entry.driedKg > 0;
        return true;
      });
  };

  const validateEntries = (phaseKey, entries) => {
    if (!entries || !entries.length) return null;
    const errors = [];
    entries.forEach((entry, i) => {
      if (phaseKey === "seasoning") {
        if (!entry.spiceId && !entry.spiceMixId)
          errors.push(`Entry ${i + 1}: Must select a spice or mix`);
        if (!entry.cuts || entry.cuts <= 0)
          errors.push(`Entry ${i + 1}: Must have valid cuts`);
        if (!entry.spiceAmountUsed || entry.spiceAmountUsed <= 0)
          errors.push(`Entry ${i + 1}: Must enter spice amount used`);
      }
    });
    return errors.length > 0 ? errors : null;
  };

  // ------------------ Submit Phase ------------------
  const handleSubmitPhase = async (goNext = true) => {
    setErrorMsg("");
    const phaseKey = PHASE_KEYS[step];
    try {
      let phaseData = { ...phases[phaseKey] };

      // Sanitize numeric fields
      if (phaseKey !== "seasoning" && phaseKey !== "vacuum")
        phaseData = sanitize(phaseData);

      // Sanitize entries
      if (phaseKey === "seasoning" || phaseKey === "vacuum") {
        phaseData.entries = sanitizeEntries(phaseKey, phaseData.entries);
        const errors = validateEntries(phaseKey, phaseData.entries);
        if (errors) {
          setErrorMsg(errors.join(", "));
          return;
        }
      }

      // Validate required fields
      if (phaseKey !== "seasoning" && phaseKey !== "vacuum") {
        const missing = validatePhase(phaseKey, phaseData);
        if (missing) {
          setErrorMsg(`Missing or invalid fields: ${missing.join(", ")}`);
          return;
        }
      }

      // Submit
      if (!currentBatch && step === 0) {
        await createBatch({ sourcingPhase: sanitize(phases.sourcing) });
      } else {
        await updatePhase(currentBatch._id, phaseKey, phaseData);
      }

      // Move to next step
      if (goNext && step < PHASE_KEYS.length - 1) setStep(step + 1);

      // Auto-finish on last step if called via "Finish Batch"
      if (!goNext && step === PHASE_KEYS.length - 1) {
        await finishBatch(currentBatch._id);
        if (onFinish) onFinish();
      }
    } catch (err) {
      console.error(`Error submitting phase "${phaseKey}":`, err);
      setErrorMsg(err.message || "An error occurred while saving the phase.");
    }
  };

  // ------------------ Phase Components ------------------
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-secondary/50 text-secondary-content shadow-xl rounded-lg overflow-hidden max-w-6xl mx-auto mt-6 p-6 flex flex-col gap-6"
    >
      <Stepper steps={PHASE_LABELS} current={step} />

      <div className="bg-accent/70 rounded-lg p-6 shadow-inner">
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

        <button
          className="btn btn-accent"
          disabled={loading}
          onClick={() =>
            handleSubmitPhase(step === PHASE_KEYS.length - 1 ? false : true)
          }
        >
          {step === PHASE_KEYS.length - 1 ? (
            <>
              <FaSave /> Finish Batch
            </>
          ) : (
            <>
              <FaSave /> Save Phase
            </>
          )}
        </button>

        {step < PHASE_KEYS.length - 1 && (
          <button
            className="btn btn-accent"
            disabled={loading}
            onClick={() => handleSubmitPhase(true)}
          >
            Next <FaArrowRight />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default BatchCreate;
