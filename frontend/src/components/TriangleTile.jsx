import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TriangleTile = ({ image, title }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      className="relative ms-2 lg:ms-0 flex flex-col items-center text-center transition-transform duration-500"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={{ rotate: isMobile ? -45 : 0 }}
      whileHover={{ scale: 1.05 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-[20vh] lg:h-[12vh] object-contain drop-shadow-md"
      />
      <span className="absolute mb-[10%] lg:mb-[15%] inset-0 flex items-center justify-center text-base lg:text-2xl font-bold text-primary drop-shadow-sm px-4">
        {title}
      </span>
    </motion.div>
  );
};

export default TriangleTile;
