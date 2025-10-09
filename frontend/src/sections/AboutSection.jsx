import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const TriangleTile = ({ image, title }) => (
  <motion.div
    className="relative flex flex-col items-center text-center"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    whileHover={{ scale: 1.05 }}
  >
    <img
      src={image}
      alt={title}
      className="w-full h-[12vh] object-contain drop-shadow-md"
    />
    <span className="absolute mb-[15%] inset-0 flex items-center justify-center text-2xl font-bold text-primary drop-shadow-sm px-4">
      {title}
    </span>
  </motion.div>
);

const BadgeTile = ({ image, text }) => (
  <motion.div
    className="relative flex flex-col items-center text-center"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    whileHover={{ scale: 1.05 }}
  >
    <img
      src={image}
      alt="badge accent"
      className="w-full h-[20vh] object-contain drop-shadow-md"
    />
    <p className="absolute inset-0 flex items-center justify-center text-sm text-primary font-medium px-6 leading-snug">
      {text}
    </p>
  </motion.div>
);

const HexaTextTile = ({ image, title, paragraphs }) => (
  <motion.div
    className="relative w-full h-[60vh] flex flex-col items-center justify-center"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
  >
    <img
      src={image}
      alt={title}
      className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
    />
      <h3 className="text-3xl font-bold text-accent">{title}</h3>
      <div className="relative z-10 text-center px-12 py-6 max-w-[70%] text-primary">
      <div className="text-base leading-relaxed space-y-4 my-8">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  </motion.div>
);

const AboutSection = () => {
  const { t } = useTranslation();
  const intro = t("about.intro", { returnObjects: true });
  const tiles = intro.tiles;

  return (
    <section id="about" className="relative w-full content-center max-h-[80vh] py-12 overflow-hidden">
      <h2 className="text-5xl font-serif font-bold place-self-center text-accent  ">
          {intro.title}
        </h2>
        <div className="w-1/4 h-[3px] bg-accent mx-auto rounded-full"></div>
      <div className="max-w-7xl mx-auto px-4 xl:px-8 grid grid-cols-[1fr_2fr_1fr] items-center pt-12">
        {/* Left Column */}
        <div className="flex flex-col items-center justify-center gap-8">
          <TriangleTile
            image={tiles.triangle["1"].image}
            title={tiles.triangle["1"].title}
          />
          <BadgeTile
            image={tiles.badge["1"].image}
            text={tiles.badge["1"].text}
          />
        </div>

        {/* Center Column */}
        <div className="flex flex-col items-center justify-center">
          <HexaTextTile
            image={tiles.hexa.image}
            title={tiles.hexa.title}
            paragraphs={tiles.hexa.text}
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-center justify-center gap-8">
          <TriangleTile
            image={tiles.triangle["2"].image}
            title={tiles.triangle["2"].title}
          />
          <BadgeTile
            image={tiles.badge["2"].image}
            text={tiles.badge["2"].text}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
