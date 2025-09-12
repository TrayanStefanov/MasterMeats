import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const AboutSection = () => {
  const { t } = useTranslation();
  const intro = t("about.intro", { returnObjects: true });

  return (
    <section id="about" className="p-20 text-base-content border-4 border-accent rounded-3xl w-4/5 mx-auto my-10">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-2 text-accent ">{intro.title}</h2>
          <h3 className="text-xl font-semibold text-secondary mb-6">
            {intro.subtitle}
          </h3>

          <div className="space-y-4 text-lg leading-relaxed">
            {Object.values(intro.paragraph).map((para, idx) => (
              <p key={idx} className="text-secondary">
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
              src="/founder.jpg"
              alt={intro.title}
              className="rounded-2xl shadow-xl object-cover"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
