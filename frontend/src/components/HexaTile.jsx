import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const HexaTile = ({ image, title, paragraphs }) => (
  <motion.div
    className="relative w-full h-[80vh] lg:h-[60vh] flex flex-col items-center justify-center"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
  >
    <img
      src={image}
      alt={title}
      className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
    />
      <h3 className="text-3xl font-bold text-accent">{title}</h3>
      <div className="relative z-10 text-center lg:px-12 py-6 max-w-[70%] text-primary">
      <div className="text-sm lg:text-base leading-relaxed space-y-4 my-8 lg:my-8 ">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  </motion.div>
);

export default HexaTile;