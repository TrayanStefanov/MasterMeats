import { motion } from "framer-motion";

const Stepper = ({ steps, current }) => {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((label, idx) => (
        <div key={idx} className="flex flex-col items-center w-full">
          <motion.div
            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 border-accent
            ${idx === current ? "bg-accent-content text-white" :
              idx < current ? "bg-accent border-secondary text-white" :
              "bg-secondary text-base-content"}`}
            layout
          >
            {idx + 1}
          </motion.div>
          <p className="text-lg font-bold mt-2 text-accent">{label}</p>
          {idx < steps.length && (
            <div className="h-1 bg-accent w-full mt-4"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
