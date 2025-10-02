import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import CoreValueCard from "../components/CoreValueCard.jsx";
import { useMediaQuery } from "../hooks/useMediaQuery.jsx";

import { GiRibbonMedal, GiKnifeFork, GiLindenLeaf, GiHeartPlus } from "react-icons/gi";

const CoreValuesSection = () => {
  const { t } = useTranslation();

  const rawValues = t("coreValues.values", { returnObjects: true });
  const values = Array.isArray(rawValues) ? rawValues : Object.values(rawValues);

  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const icons = [GiRibbonMedal, GiKnifeFork, GiLindenLeaf, GiHeartPlus];

  // Reset hovered whenever something is selected
  useEffect(() => {
    if (selected !== null) {
      setHovered(null);
    }
  }, [selected]);

  // Determine which card is active
  const effectiveIndex = selected ?? hovered;

  return (
    <section
      id="core-values"
      className="py-20 bg-[url('/images/dark-wood.jpg')] bg-cover bg-center text-white"
    >
      <div className="container mx-auto text-center mb-12 text-accent">
        <h2 className="text-4xl font-emphasis-heading font-bold mb-2">
          {t("coreValues.title")}
        </h2>
        <h3 className="text-2xl italic font-light font-emphasis-text">
          {t("coreValues.subtitle")}
        </h3>
      </div>

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {values.map((val, idx) => (
          <CoreValueCard
            key={val.title ?? idx}
            value={{
              ...val,
              Icon: icons[idx],
            }}
            index={idx}
            isDesktop={Boolean(isDesktop)}
            isSelected={
              (!isDesktop && selected === idx) ||
              (isDesktop && (selected === idx || hovered === idx))
            }
            onSelect={(i) => {
              setSelected((prev) => (prev === i ? null : i));
            }}
            onHover={(i) => {
              if (isDesktop && selected === null) {
                setHovered(i);
              }
            }}
            onHoverEnd={() => {
              if (isDesktop && selected === null) {
                setHovered(null);
              }
            }}
          />
        ))}
      </div>

      {/* Expanded info for Desktop */}
      {isDesktop && (
        <AnimatePresence mode="wait">
          {effectiveIndex !== null && (
            <motion.div
              key={effectiveIndex}
              className="container mx-auto mt-10 relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.55 } }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.45 } }}
            >
              <div className="relative z-10 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-primary">
                {/* Text */}
                <motion.div
                  key="text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="font-serif font-bold text-3xl text-accent mb-2">
                    {values[effectiveIndex].title}
                  </h3>
                  <p className="font-semibold mb-4 italic text-xl">
                    {values[effectiveIndex].subtitle}
                  </p>
                  <p className="text-lg">{values[effectiveIndex].description}</p>
                </motion.div>
                {values[effectiveIndex].image && (
                  <motion.div
                    key="image"
                    className="flex justify-center"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <img
                      src={values[effectiveIndex].image}
                      alt={values[effectiveIndex].title}
                      className="rounded-xl max-h-64 object-contain shadow-lg"
                    />
                  </motion.div>
                )}
              </div>
              <div className="absolute inset-0 pointer-events-none">
                <img
                  src="/parchment-overlay.jpg"
                  alt="parchment texture"
                  className="w-full h-full object-cover opacity-50"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
};

export default CoreValuesSection;
