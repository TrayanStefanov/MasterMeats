import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronRight } from "react-icons/fa";

const FAQItem = ({ question, answer, idx }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="border-b border-base-300 py-4"
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex justify-between items-center w-full text-left"
      >
        <span className="font-semibold text-accent text-lg lg:text-xl 2xl:text-2xl">
          {question}
        </span>
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          className="ml-2 text-2xl text-accent"
        >
          <FaChevronRight />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 text-base lg:text-lg text-primary px-2"
          >
            {answer}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FAQItem;
