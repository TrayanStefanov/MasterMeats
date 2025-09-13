import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQItem = ({ question, answer, idx }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="border-b border-base-300 py-3"
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex justify-between items-center w-full text-left"
      >
        <span className="font-semibold">{question}</span>
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          className="ml-2 text-lg"
        >
          ▶
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 text-sm text-neutral-content"
          >
            {answer}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FAQItem;