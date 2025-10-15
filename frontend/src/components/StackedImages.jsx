import { motion } from "framer-motion";

const StackedImages = ({ images, reverse }) => {
  return (
    <div className="relative w-full h-[40vh] flex justify-center items-center">
      {images.map((src, i) => {
        const direction = reverse ? 1 : -1; // flip offsets if reversed
        return (
          <motion.img
            key={i}
            src={src}
            alt={`Product view ${i + 1}`}
            className="absolute w-[55%] h-[35vh] object-cover rounded-3xl border-8 border-accent/90 shadow-md cursor-pointer"
            style={{ zIndex: 10 - i }}
            initial={{
              x: i * 60 * direction,
              y: i * 40,
              scale: 1 - i * 0.05,
              rotate: i * 2 * direction,
              opacity: 1 - i * 0.1,
            }}
            whileHover={{
              scale: 1.05,
              y: i * 10 - 10,
              zIndex: 20,
              opacity: 1,
              transition: { type: "spring", stiffness: 250, damping: 20 },
            }}
          />
        );
      })}
    </div>
  );
};

export default StackedImages;
