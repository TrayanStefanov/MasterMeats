import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const HeroSection = () => {

  const { t } = useTranslation();

  const letterVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const titleLetters = t("home.title").split("");
  return (
    <div className="relative min-h-[80vh] lg:min-h-screen overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: "url(/background.png)" }} />
      <motion.div className="absolute inset-0 bg-neutral/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />

      {/* Content */}
      <div className="relative z-10 text-center text-neutral-content flex flex-col items-center justify-center h-full p-6 md:p-12 lg:p-20 gap-6">
        {/* Title build-up */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold max-w-4xl flex flex-wrap justify-center leading-tight mt-32 ">
          {titleLetters.map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl max-w-4xl leading-snug"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          {t("home.subtitle")}
        </motion.h2>

        {/* More */}
        <motion.h3
          className="text-xl sm:text-2xl lg:text-3xl max-w-4xl font-light"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          {t("home.more")}
        </motion.h3>
      </div>
    </div>
      );
};

export default HeroSection
