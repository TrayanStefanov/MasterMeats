import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import CoreValueCard from "../components/CoreValueCard.jsx";
import { useMediaQuery } from "../hooks/useMediaQuery.jsx";

// icons
import { SiCodefresh } from "react-icons/si";
import { TbMeat } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa";
import { LuThumbsUp } from "react-icons/lu";

const CoreValuesSection = () => {
  const { t } = useTranslation();
  const rawValues = t("coreValues.values", { returnObjects: true });
  const values = Array.isArray(rawValues) ? rawValues : Object.values(rawValues);

  const [selected, setSelected] = useState(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const icons = [LuThumbsUp, TbMeat, SiCodefresh, FaRegHeart ];
  const images = [
    "/images/code.png",
    "/images/meat.png",
    "/images/heart.png",
    "/images/thumbsup.png"
  ];

  return (
    <section id="core-values" className="py-20 bg-secondary text-accent">
      <div className="container mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-2">{t("coreValues.title")}</h2>
        <h3 className="text-3xl font-bold">{t("coreValues.subtitle")}</h3>
      </div>

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {values.map((value, idx) => (
          <CoreValueCard
            key={value.title ?? idx}
            value={{ ...value, Icon: icons[idx], image: images[idx] }}
            index={idx}
            isDesktop={Boolean(isDesktop)}
            isSelected={selected === idx}
            onSelect={(i) => setSelected((prev) => (prev === i ? null : i))}
          />
        ))}
      </div>

      {isDesktop && (
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              key={values[selected].title}
              className="container mx-auto mt-10 p-8 shadow-lg shadow-accent/30 bg-white rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-primary"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.55 } }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.45 } }}
            >
              <div>
                <h3 className="font-bold text-3xl text-accent mb-2">
                  {values[selected].title}
                </h3>
                <p className="font-semibold mb-2 italic text-xl">
                  {values[selected].subtitle}
                </p>
                <p className="text-lg">{values[selected].description}</p>
              </div>

              {values[selected].image && (
                <div className="flex justify-center">
                  <img
                    src={values[selected].image}
                    alt={values[selected].title}
                    className="rounded-xl max-h-64 object-contain"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
};

export default CoreValuesSection;
