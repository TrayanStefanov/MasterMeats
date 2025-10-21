import { motion } from "framer-motion";
import KeyCard from "../components/KeyCard.jsx";
import { useTranslation } from "react-i18next";

const AboutSection = () => {
  const { t } = useTranslation();
  const keycards = t("about.keycards", { returnObjects: true });

  return (
    <section id="about" className="bg-background text-primary py-4 md:py-8 lg:py-10">
      <div className="max-w-7xl mx-auto text-center mb-12 px-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-accent mb-4">
          {t("about.title")}
        </h2>
        <div className="w-1/2 h-[3px] bg-accent mx-auto rounded-full mb-8"></div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-base md:text-lg leading-relaxed text-semibold max-w-3xl mx-auto"
        >
          {t("about.intro")}
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 px-6 lg:px-12 items-start">
        <div className="flex flex-col gap-6">
          {keycards.map((card, index) => (
            <KeyCard
              key={index}
              title={card.title}
              text={card.text}
              delay={index * 0.1}
            />
          ))}
        </div>

        <div className="flex flex-col justify-between items-center h-full gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-4/5 aspect-[3/4] overflow-hidden rounded-2xl shadow-lg shadow-accent mx-auto"
          >
            <img
              src="/about.jpg"
              alt={t("about.title")}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card p-8 rounded-2xl shadow-md shadow-accent flex flex-col justify-center w-full lg:w-4/5"
          >
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground text-accent text-center italic font-bold">
              {t("about.footer")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
