import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaSave } from "react-icons/fa";

import { useBatchStore } from "../stores/useBatchStore";

// PHASE COMPONENTS
import PhaseSourcing from "./PhaseSourcing";
import PhasePrepping from "./PhasePrepping";
import PhaseCuring from "./PhaseCuring";
import PhaseSeasoning from "./PhaseSeasoning";
import PhaseVacuum from "./PhaseVacuumSealing";

import Stepper from "./PhasesStepper";

const BatchCreate = () => {
  const { createBatch, updatePhase, batch, loading } = useBatchStore();

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

  const handleSubmitPhase = async () => {
    const phaseKey = phaseKeys[step];
    const dataToSend = phases[phaseKey];

    // CREATE batch on first phase
    if (!batch) {
      if (step === 0) {
        await createBatch(dataToSend);
      }
    } else {
      // UPDATE subsequent phases
      await updatePhase(batch._id, phaseKey, dataToSend);
    }

    if (step < phaseKeys.length - 1) {
      setStep(step + 1);
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
