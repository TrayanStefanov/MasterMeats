import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import CoreValueCard from "../components/CoreValueCard.jsx";
import { useMediaQuery } from "../hooks/useMediaQuery.jsx";

import {
  GiRibbonMedal,
  GiKnifeFork,
  GiLindenLeaf,
  GiHeartPlus,
} from "react-icons/gi";

const CoreValuesSection = () => {
  const { t } = useTranslation("coreValuesSection");
  const rawValues = t("values", { returnObjects: true });
  const values = Array.isArray(rawValues)
    ? rawValues
    : Object.values(rawValues);

  const [selected, setSelected] = useState(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const icons = [GiRibbonMedal, GiKnifeFork, GiLindenLeaf, GiHeartPlus];

  return (
    <section
      id="core-values"
      className="relative flex flex-col my-20 justify-center items-center text-white overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: selected !== null ? 0.6 : 0.3 }}
        transition={{ duration: 0.4 }}
      />

      <div className="relative z-20 flex flex-col items-center w-full">
        <div className="text-center px-4 mt-12 mb-12 lg:mt-0">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-emphasis-heading font-bold mb-2 text-accent">
            {t("title")}
          </h2>
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
      </div>

      {/* Expanded info for Desktop */}
      {isDesktop && (
        <AnimatePresence mode="wait">
          {selected !== null && (
            <motion.div
              key={selected}
              className="relative w-full px-6 md:px-12 z-30 mt-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div
                className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center 
               p-10 rounded-3xl border-t-0
               bg-white/20 backdrop-blur-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-white/10 to-transparent pointer-events-none rounded-3xl" />

                <motion.div
                  key="text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="relative h-full flex flex-col justify-between z-10 text-primary p-8"
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
