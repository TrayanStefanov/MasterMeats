import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const CoreValueCard = ({
  value,
  index,
  isDesktop,
  isSelected,
  onSelect,
  onHover,
  onHoverEnd,
}) => {
  return (
    <motion.div
      className="group relative p-6 cursor-pointer overflow-hidden transition-transform duration-200 hover:shadow-xl border-4 border-accent rounded-2xl"
      onClick={() => onSelect(index)}
      onMouseEnter={() => isDesktop && onHover(index)}
      onMouseLeave={() => isDesktop && onHoverEnd()}
      whileHover={isDesktop ? { scale: 1.03 } : {}}
    >
      <div className="flex flex-col items-center gap-3 text-accent">
        {value.Icon && <value.Icon className="text-5xl" />}
        <h3 className="text-2xl font-serif font-bold">{value.title}</h3>
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
                <p className="text-accent">{value.description}</p>
              </div>
              {value.image && (
                <div className="w-full flex justify-end">
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
