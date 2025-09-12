import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import CoreValueCard from "../components/CoreValueCard";

const CoreValuesSection = () => {
  const { t } = useTranslation();
  const values = t("coreValues.values", { returnObjects: true });

  const [selected, setSelected] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Handle screen resize to update desktop/mobile detection
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section id="core-values" className="py-20 text-accent-content">
      {/* Section Title */}
      <div className="container mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold">{t("coreValues.title")}</h2>
      </div>

      {/* Grid of Values */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {Object.values(values).map((value) => (
          <CoreValueCard
            key={value.title}
            value={value}
            isDesktop={isDesktop}
            onSelect={() =>
              setSelected((prev) => (prev?.title === value.title ? null : value))
            }
          />
        ))}
      </div>

      {/* Expanded Details Section */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="container mx-auto mt-10 p-6 rounded-2xl border-2 border-accent-content shadow-md text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.55 } }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.45 } }}
          >
            <h3 className="text-2xl font-bold mb-2">{selected.title}</h3>
            <p className="font-semibold text-secondary mb-2 italic">
              {selected.subtitle}
            </p>
            <p className="text-sm text-primary-content">{selected.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CoreValuesSection;
