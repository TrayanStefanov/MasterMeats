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
const ADDITIVE_PHASES = ["seasoning", "vacuum"];

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
    addPhaseEntry,
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
        (ADDITIVE_PHASES.includes(key) &&
          (!data.entries || data.entries.length === 0))
      ) {
        nextStep = i;
        break;
      }
      nextStep = i + 1;
    }
    setStep(Math.min(nextStep, PHASE_KEYS.length - 1));
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

  // ------------------ Submit Phase ------------------
  const handleSubmitPhase = async (goNext = true) => {
    setErrorMsg("");
    const phaseKey = PHASE_KEYS[step];
    try {
      let phaseData = ADDITIVE_PHASES.includes(phaseKey)
        ? { ...phases[phaseKey] }
        : sanitize(phases[phaseKey]);

      // ----------------- Seasoning -----------------
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
            timeTaken: Number(phaseData.timeTaken || 0),
            paperTowelCost: Number(phaseData.paperTowelCost || 0),
          });
        }
      }
      // ----------------- Vacuum -----------------
      else if (phaseKey === "vacuum" && currentBatch) {
        await addPhaseEntry(currentBatch._id, "vacuum", {
          entries: phaseData.entries || [],
          timeTaken: Number(phaseData.timeTaken || 0),
          vacuumRollCost: Number(phaseData.vacuumRollCost || 0),
        });
      }
      // ----------------- Other phases -----------------
      else {
        const missing = validatePhase(phaseKey, phaseData);
        if (missing) {
          setErrorMsg(`Missing or invalid fields: ${missing.join(", ")}`);
          return;
        }

        if (!currentBatch && step === 0) {
          await createBatch({ sourcingPhase: sanitize(phases.sourcing) });
        } else {
          await updatePhase(currentBatch._id, phaseKey, phaseData);
        }
      }

      // Move to next step if not just saving
      if (goNext && step < PHASE_KEYS.length - 1) setStep(step + 1);
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

        <button
          className="btn btn-secondary"
          disabled={loading}
          onClick={handleSubmitPhase}
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
            className="btn btn-primary"
            disabled={loading}
            onClick={handleSubmitPhase}
          >
            Next <FaArrowRight />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default BatchCreate;
