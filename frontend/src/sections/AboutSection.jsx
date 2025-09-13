import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const AboutSection = () => {
  const { t } = useTranslation();
  const intro = t("about.intro", { returnObjects: true });

  return (
    <section id="about" className="bg-secondary ">
      <div className="p-8 lg:px-20 lg:w-4/5 mx-auto">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-2 text-accent ">{intro.title}</h2>
            <h3 className="text-2xl font-semibold text-accent-content mb-6">
              {intro.subtitle}
            </h3>

            <div className="space-y-4 text-xl leading-relaxed">
              {Object.values(intro.paragraph).map((para, idx) => (
                <p key={idx} className="text-primary">
                  {para}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-full max-w-md">
              <img
                src="/about.jpg"
                alt={intro.title}
                className="shadow-xl object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
