import React, { useState } from "react";
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
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const icons = [GiRibbonMedal, GiKnifeFork, GiLindenLeaf, GiHeartPlus];

  return (
    <section
      id="core-values"
      className="relative min-h-[700px] flex flex-col justify-center items-center text-white bg-primary-content/60 bg-cover bg-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-black/40"
        animate={{ opacity: selected !== null ? 0.6 : 0.3 }}
        transition={{ duration: 0.4 }}
      />

      <motion.div
        className="relative z-20 flex flex-col items-center w-full"
        initial={{ y: 0 }}
        animate={{ y: selected !== null && isDesktop ? -180 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="text-center px-4 mt-12 mb-12 lg:mt-0">
          <h2 className="text-4xl font-emphasis-heading font-bold mb-2 text-accent">
            {t("coreValues.title")}
          </h2>
          <h3 className="text-2xl italic font-light font-emphasis-text">
            {t("coreValues.subtitle")}
          </h3>
        </div>

        <motion.div
          className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 1, y: 0 }}
          animate={{
            y: selected !== null && isDesktop ? -30 : 0,
            opacity: selected !== null && isDesktop ? 0.85 : 1,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {values.map((val, idx) => (
            <CoreValueCard
              key={val.title ?? idx}
              value={{ ...val, Icon: icons[idx] }}
              index={idx}
              isDesktop={isDesktop}
              isSelected={selected === idx}
              onSelect={(i) => setSelected((prev) => (prev === i ? null : i))}
              onHover={() => {}}
              onHoverEnd={() => {}}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Expanded info for Desktop */}
      {isDesktop && (
        <AnimatePresence mode="wait">
          {selected !== null && (
            <motion.div
              key={selected}
              className="absolute bottom-0 left-0 w-full px-6 md:px-12 z-30"
              initial={{ opacity: 0, y: 150 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 150 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-10 rounded-t-3xl shadow-2xl border-t border-accent/30 overflow-hidden">
                
                <motion.div
                  className="absolute inset-0 z-0 opacity-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.9 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <img
                    src="/parchment-overlay.jpg"
                    alt="Parchment texture"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <motion.div
                  key="text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="relative z-10 text-primary"
                >
                  <h3 className="font-serif font-bold text-3xl text-accent mb-2">
                    {values[selected].title}
                  </h3>
                  <p className="italic text-xl font-semibold mb-4">
                    {values[selected].subtitle}
                  </p>
                  <p className="text-lg leading-relaxed">
                    {values[selected].description}
                  </p>
                </motion.div>

                {values[selected].image && (
                  <motion.div
                    key="image"
                    className="relative z-10 flex justify-center"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <img
                      src={values[selected].image}
                      alt={values[selected].title}
                      className="rounded-xl max-h-72 object-contain shadow-lg"
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
};

export default CoreValuesSection;
