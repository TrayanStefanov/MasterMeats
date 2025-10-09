import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import TriangleTile from "../components/TriangleTile.jsx";
import BadgeTile from "../components/BadgeTile.jsx";
import HexaTile from "../components/HexaTile.jsx";

const AboutSection = () => {
  const { t } = useTranslation();
  const intro = t("about.intro", { returnObjects: true });
  const tiles = intro.tiles;

  return (
    <section id="about" className="relative w-full content-center lg:max-h-[80vh] py-6 lg:py-12 overflow-hidden">
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold place-self-center text-accent  ">
          {intro.title}
        </h2>
        <div className="w-1/4 h-[3px] bg-accent mx-auto rounded-full"></div>
      <div className="max-w-7xl mx-auto lg:px-4 xl:px-8 lg:grid lg:grid-cols-[1fr_2fr_1fr] items-center pt-2 lg:pt-12">
        {/* Left Column */}
        <div className="flex lg:flex-col items-center justify-center gap-1 lg:gap-8">
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
          <HexaTile
            image={tiles.hexa.image}
            title={tiles.hexa.title}
            paragraphs={tiles.hexa.text}
          />
        </div>

        {/* Right Column */}
        <div className="flex lg:flex-col items-center justify-center gap-1 lg:gap-8">
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


