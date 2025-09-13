import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const CoreValueCard = ({ value, index, isDesktop, isSelected, onSelect }) => {
  return (
    <motion.div
      className="group relative p-6 shadow-md shadow-accent cursor-pointer overflow-hidden"
      onClick={() => !isDesktop && onSelect(index)}        // mobile: toggle inside-card
      onMouseEnter={() => isDesktop && onSelect(index)}    // desktop: set external detail
      onMouseLeave={() => isDesktop && onSelect(null)}     // desktop: clear external detail
      whileHover={isDesktop ? { scale: 1.03 } : {}}
    >
      <h3 className="text-3xl font-bold mb-2">{value.title}</h3>

      {/* Mobile-only inline expansion */}
      {!isDesktop && (
        <AnimatePresence initial={false}>
          {isSelected && (
            <motion.div
              className="mt-2 text-2xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-semibold text-primary italic mb-1">
                {value.subtitle}
              </p>
              <p>{value.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default CoreValueCard;
