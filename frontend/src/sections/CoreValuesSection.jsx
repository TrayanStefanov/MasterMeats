import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import CoreValueCard from "../components/CoreValueCard.jsx";
import { useMediaQuery } from "../hooks/useMediaQuery.jsx";

const CoreValuesSection = () => {
  const { t } = useTranslation();
  const rawValues = t("coreValues.values", { returnObjects: true });
  const values = Array.isArray(rawValues) ? rawValues : Object.values(rawValues);

  const [selected, setSelected] = useState(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <section id="core-values" className="py-20 bg-secondary text-accent">
      {/* Section Title */}
      <div className="container mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold">{t("coreValues.title")}</h2>
      </div>

      {/* Grid of Values */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {values.map((value, idx) => (
          <CoreValueCard
            key={value.title ?? idx}
            value={value}
            index={idx}
            isDesktop={Boolean(isDesktop)}
            isSelected={selected === idx}
            onSelect={(i) => setSelected((prev) => (prev === i ? null : i))}
          />
        ))}
      </div>

      {/* Desktop-only expanded section with AnimatePresence */}
      {isDesktop && (
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              key={values[selected].title}
              className="container mx-auto mt-10 p-6 shadow-md shadow-accent text-primary text-center text-2xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.55 } }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.45 } }}
            >
              <h3 className="font-bold text-accent mb-2">{values[selected].title}</h3>
              <p className="font-semibold mb-2 italic text-xl">
                {values[selected].subtitle}
              </p>
              <p className="text-xl">
                {values[selected].description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
};

export default CoreValuesSection;
