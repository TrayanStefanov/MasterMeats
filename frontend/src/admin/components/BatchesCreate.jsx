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

const BatchCreate = () => {
  const { createBatch, updatePhase, currentBatch, loading } = useBatchStore();

  const [step, setStep] = useState(0);

  const [phases, setPhases] = useState({
    sourcing: {
      meatType: "",
      meatCutType: "",
      supplier: "",
      amountKg: "",
      pricePerKg: "",
      timeTaken: "",
    },
    prepping: {
      meatType: "",
      rawKg: "",
      wasteKg: "",
      cookingCutsKg: "",
      timeTaken: "",
    },
    curing: {
      saltName: "",
      saltAmountKg: "",
      saltTimeHours: "",
      liquidType: "",
      liquidTimeHours: "",
      rinseTime: "",
      timeTaken: "",
    },

    seasoning: {
      entries: [],
      timeTaken: "",
    },

    vacuum: {
      entries: [],
      timeTaken: "",
    },
  });

  const phaseKeys = [
    "sourcing",
    "prepping",
    "curing",
    "seasoning",
    "vacuum",
  ];

  const phaseLabels = [
    "Sourcing",
    "Prepping",
    "Curing",
    "Seasoning",
    "Vacuum Sealing",
  ];

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

  const sanitizePhaseData = (phaseData) => {
    const sanitized = { ...phaseData };
    Object.keys(sanitized).forEach((key) => {
      if (sanitized[key] === "")
        sanitized[key] = 0; // default numeric fields to 0
      else if (!isNaN(sanitized[key])) sanitized[key] = Number(sanitized[key]);
    });
    return sanitized;
  };

  const handleSubmitPhase = async () => {
    const phaseKey = phaseKeys[step];
    let dataToSend = sanitizePhaseData(phases[phaseKey]);

    try {
      if (!currentBatch && step === 0) {
        // Create new batch
        const batchData = {
          sourcingPhase: sanitizePhaseData(phases.sourcing),
          preppingPhase: sanitizePhaseData(phases.prepping),
          curingPhase: sanitizePhaseData(phases.curing),
          seasoningPhase: phases.seasoning.entries,
          vacuumPhase: phases.vacuum.entries,
        };

        console.log("Creating initial batch:", batchData);
        await createBatch(batchData);
      } else {
        console.log(`Updating phase "${phaseKey}" for batch`, currentBatch._id);
        await updatePhase(currentBatch._id, phaseKey, dataToSend);
      }

      if (step < phaseKeys.length - 1) setStep(step + 1);
    } catch (err) {
      console.error("Error submitting phase:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full mx-auto flex flex-col gap-10"
    >
      <Stepper steps={phaseLabels} current={step} />
      <div className="bg-base-200 rounded-xl p-6 shadow-md">
        {phaseComponents[step]}
      </div>

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
          {step === phaseKeys.length - 1 ? (
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
