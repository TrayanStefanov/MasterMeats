import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BadgeTile = ({ image, text }) => (
  <motion.div
    className="relative flex me-1 lg:me-0 flex-col items-center text-center"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    whileHover={{ scale: 1.05 }}
  >
    <img
      src={image}
      alt="badge accent"
      className="w-full h-[40vh] lg:h-[20vh] object-contain drop-shadow-md"
    />
    <p className="absolute inset-0 flex items-center justify-center text-xs lg:text-sm text-primary font-medium px-3 lg:px-6 leading-snug">
      {text}
    </p>
  </motion.div>
);

export default BadgeTile;