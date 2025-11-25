import { motion } from "framer-motion";

const Stepper = ({ steps, current }) => {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((label, idx) => (
        <div key={idx} className="flex flex-col items-center w-full">
          <motion.div
            className={`w-10 h-10 flex items-center justify-center rounded-full 
            ${idx === current ? "bg-primary text-white" :
              idx < current ? "bg-success text-white" :
              "bg-base-300 text-base-content"}`}
            layout
          >
            {idx + 1}
          </motion.div>
          <p className="text-sm mt-2">{label}</p>
          {idx < steps.length - 1 && (
            <div className="h-1 bg-base-300 w-full mt-4"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
