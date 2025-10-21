import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const swipeConfidenceThreshold = 10000;

const MobileImageCarousel = ({ images, title }) => {
  const [current, setCurrent] = useState(0);

  const paginate = (direction) => {
    setCurrent((prev) =>
      direction === 1
        ? (prev + 1) % images.length
        : (prev - 1 + images.length) % images.length
    );
  };

  return (
    <div className="md:hidden w-full flex justify-center items-center relative overflow-hidden py-4">
      {/* Image wrapper */}
      <div className="relative w-5/6 h-48 overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={current}
            src={images[current]}
            alt={`${title}-${current}`}
            className="absolute w-full h-full object-cover rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          />
        </AnimatePresence>

        <button
          onClick={() => paginate(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-secondary bg-accent/70 text-secondary flex items-center justify-center z-20"
        >
          <FaChevronLeft />
        </button>

        <button
          onClick={() => paginate(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-secondary bg-accent/70 text-secondary flex items-center justify-center z-20"
        >
          <FaChevronRight />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, i) => (
            <motion.div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${
                i === current ? "bg-accent" : "bg-secondary/70"
              }`}
              animate={{ scale: i === current ? 1.4 : 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileImageCarousel;
