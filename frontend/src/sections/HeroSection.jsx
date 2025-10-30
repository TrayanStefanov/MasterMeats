import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSmoothScrollNav } from "../hooks/useSmoothScrollNav";

const HeroSection = () => {
  const { t } = useTranslation("homeSection");

  // Define navigation links for the hook
  const navLinks = [
    { href: "#hero" },
    { href: "#products" },
    { href: "#about" },
    { href: "#contacts" },
  ];

  // Use the smooth scroll hook
  const { scrollToSection } = useSmoothScrollNav(navLinks);

  const wordVariants = {
    hiddenTop: { opacity: 0, y: -40 },
    hiddenBottom: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  const titleWords = t("title").split(" ");

  const buttonVariants = {
    hiddenLeft: { opacity: 0, x: -50 },
    hiddenRight: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <section
      id="hero"
      role="banner"
      aria-label={t("title")}
      className="relative min-h-[80vh] lg:min-h-[91vh] overflow-hidden flex items-center justify-center bg-base-100"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-100"
        style={{ backgroundImage: "url(/bg-2.jpg)" }}
      />
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Content */}
      <div className="relative z-10 text-center text-secondary flex flex-col items-center justify-between font-emphasis-heading min-h-[80vh] p-8 md:p-12 lg:p-20 gap-8">
        {/* Title */}
        <div className="px-6 lg:px-0">
          <h1
            key={t("title")}
            className="text-4xl md:text-5xl lg:text-6xl max-w-4xl flex flex-wrap justify-center leading-tight mt-8 sm:mt-16 lg:mt-0"
          >
            {titleWords.map((word, index) => (
              <motion.span
                key={index}
                variants={wordVariants}
                initial={index % 2 === 0 ? "hiddenTop" : "hiddenBottom"}
                animate="visible"
                transition={{ delay: index * 0.15 }}
                className="inline-block mx-2 whitespace-pre"
              >
                {word}
              </motion.span>
            ))}
          </h1>
        </div>

        {/* Subtitle */}
        <div className="justify-items-center mb-16 lg:mb-0">
          <motion.h2
            className="text-2xl lg:text-3xl 2xl:text-4xl max-w-4xl leading-snug px-6 lg:px-0 lg:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            {t("subtitle")}
          </motion.h2>

          {/* Buttons */}
          <div className="flex flex-col lg:flex-row gap-4 mt-6">
            <motion.button
              initial="hiddenLeft"
              animate="visible"
              whileHover="hover"
              variants={buttonVariants}
              className="btn btn-primary w-80 lg:btn-wide rounded-lg border-4 border-accent text-primary-content/70 text-lg lg:text-xl 2xl:text-2xl hover:border-accent-content/70 hover:text-primary-content"
              onClick={() => scrollToSection("#products")}
            >
              {t("btnProducts")}
            </motion.button>
            <motion.button
              initial="hiddenRight"
              animate="visible"
              whileHover="hover"
              variants={buttonVariants}
              className="btn btn-primary w-80 lg:btn-wide rounded-lg border-4 border-accent text-primary-content/70 text-lg lg:text-xl 2xl:text-2xl hover:border-accent-content/70 hover:text-primary-content"
              onClick={() => scrollToSection("#about")}
            >
              {t("btnAbout")}
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
