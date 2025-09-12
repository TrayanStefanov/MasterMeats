import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CoreValueCard = ({ value, isDesktop }) => {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const showDetails = isDesktop ? hovered : expanded;

  return (
    <motion.div
      className="group relative p-6 border-2 border-base-300 rounded-2xl bg-base-100 shadow-md cursor-pointer overflow-hidden"
      onClick={() => !isDesktop && setExpanded((prev) => !prev)}
      onMouseEnter={() => isDesktop && setHovered(true)}
      onMouseLeave={() => isDesktop && setHovered(false)}
      whileHover={isDesktop ? { scale: 1.03 } : {}}
    >
      <h3 className="text-2xl font-bold mb-2">{value.title}</h3>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="overflow-hidden mt-2"
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: 500, transition: { duration: 0.35, ease: "easeInOut" } }}
            exit={{ opacity: 0, maxHeight: 0, transition: { duration: 0.35, ease: "easeInOut" } }}
          >
            <p className="font-semibold text-secondary mb-2">{value.subtitle}</p>
            <p className="text-sm text-neutral-content">{value.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CoreValueCard;