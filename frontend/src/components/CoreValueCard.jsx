import React from "react";
import { motion } from "framer-motion";

const CoreValueCard = ({ value, isDesktop, onSelect }) => {
  return (
    <motion.div
      className="group relative p-6 border-2 border-accent-content rounded-2xl shadow-md cursor-pointer overflow-hidden"
      onClick={() => !isDesktop && onSelect()}
      onMouseEnter={() => isDesktop && onSelect()}
      onMouseLeave={() => isDesktop && onSelect(null)}
      whileHover={isDesktop ? { scale: 1.03 } : {}}
    >
      <h3 className="text-2xl font-bold mb-2">{value.title}</h3>
    </motion.div>
  );
};

export default CoreValueCard;
