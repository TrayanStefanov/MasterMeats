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

// Define required fields for each phase
const REQUIRED_FIELDS = {
  sourcing: ["meatType", "meatCutType", "supplier", "amountKg", "pricePerKg"],
  prepping: [], // no required fields now
  curing: [],
  seasoning: [],
  vacuum: [],
};

const BatchCreate = () => {
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
      saltTimeHours: "",
      liquidType: "",
      liquidTimeHours: "",
      rinseTime: "",
      timeTaken: "",
    },
    seasoning: { entries: [], timeTaken: "" },
    vacuum: { entries: [], timeTaken: "" },
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
    />,
  ];

  // Sanitize numeric fields
  const sanitize = (data) =>
    Object.fromEntries(
      Object.entries(data).map(([k, v]) => [
        k,
        v === "" ? 0 : !isNaN(v) ? Number(v) : v,
      ])
    );

  // Validate required fields
  const validatePhase = (phaseKey, data) => {
    const required = REQUIRED_FIELDS[phaseKey];
    const missing = required.filter(
      (f) => data[f] === "" || data[f] === null || data[f] === undefined
    );
    return missing.length > 0 ? missing : null;
  };

  // Validate additive entries
  const validateAdditiveEntries = (phaseKey, entries) => {
    const errors = [];
    entries.forEach((entry, i) => {
      if (!entry.spiceId && !entry.spiceMixId) {
        errors.push(`Entry ${i + 1} must have a spiceId or spiceMixId`);
      }
      if (!entry.cuts || entry.cuts <= 0) {
        errors.push(`Entry ${i + 1} must have valid cuts`);
      }
    });
    return errors.length > 0 ? errors : null;
  };

  const handleSubmitPhase = async () => {
    const phaseKey = PHASE_KEYS[step];
    const phaseData = sanitize(phases[phaseKey]);
    setErrorMsg("");

    try {
      // Check required fields
      const missingFields = ADDITIVE_PHASES.includes(phaseKey)
        ? validateAdditiveEntries(phaseKey, phaseData.entries)
        : validatePhase(phaseKey, phaseData);

      if (missingFields) {
        setErrorMsg(`Missing or invalid fields: ${missingFields.join(", ")}`);
        return;
      }

      if (!currentBatch && step === 0) {
        // Initial batch creation
        const batchData = {
          sourcingPhase: sanitize(phases.sourcing),
          preppingPhase: sanitize(phases.prepping),
          curingPhase: sanitize(phases.curing),
          seasoningPhase: phases.seasoning.entries,
          vacuumPhase: phases.vacuum.entries,
        };
        console.log("Submitting batchData:", batchData);
        await createBatch(batchData);
      } else if (ADDITIVE_PHASES.includes(phaseKey)) {
        // Add all entries in one batch
        if (phaseData.entries.length > 0) {
          await addPhaseEntry(currentBatch._id, phaseKey, phaseData.entries);
        }
      } else {
        // Update standard phase
        await updatePhase(currentBatch._id, phaseKey, phaseData);
      }

      if (step < PHASE_KEYS.length - 1) setStep(step + 1);
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

      <div className="flex justify-between mt-4">
        <button
          className="btn btn-accent"
          disabled={step === 0}
          onClick={() => setStep(step - 1)}
        >
          <FaArrowLeft /> Back
        </button>

        <button
          className="btn btn-primary"
          disabled={loading}
          onClick={handleSubmitPhase}
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
    </motion.div>
  );
};

export default BatchCreate;
