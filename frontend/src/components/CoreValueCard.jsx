import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const CoreValueCard = ({ value, index, isDesktop, isSelected, onSelect }) => {
  return (
    <motion.div
      className="group relative p-6 shadow-lg shadow-accent/30 rounded-2xl cursor-pointer overflow-hidden bg-white text-primary transition-transform duration-200 hover:shadow-xl"
      onClick={() => !isDesktop && onSelect(index)}        // mobile toggle
      onMouseEnter={() => isDesktop && onSelect(index)}    // desktop hover
      onMouseLeave={() => isDesktop && onSelect(null)}     // desktop leave
      whileHover={isDesktop ? { scale: 1.03 } : {}}
    >
      <div className="flex flex-col items-center gap-3">
        {value.Icon && <value.Icon className="text-5xl text-accent" />}
        <h3 className="text-2xl font-bold">{value.value}</h3>
      </div>

      {!isDesktop && (
        <AnimatePresence initial={false}>
          {isSelected && (
            <motion.div
              className="mt-4 grid grid-cols-1 gap-4 items-center text-left"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h4 className="text-xl font-semibold text-accent mb-2">
                  {value.title}
                </h4>
                <p className="italic mb-2">{value.subtitle}</p>
                <p>{value.description}</p>
              </div>

              {value.image && (
                <div className="w-full flex justify-center">
                  <img
                    src={value.image}
                    alt={value.title}
                    className="rounded-xl max-h-48 object-contain"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default CoreValueCard;
