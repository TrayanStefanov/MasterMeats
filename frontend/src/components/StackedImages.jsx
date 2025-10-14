import { motion } from "framer-motion";

const StackedImages = ({ images }) => {
  return (
    <div className="relative w-full h-[45vh] flex justify-center items-center">
      {images.map((src, i) => (
        <motion.img
          key={i}
          src={src}
          alt={`Product view ${i + 1}`}
          className="absolute w-[65%] h-[40vh] object-cover rounded-3xl border-8 border-accent/90 shadow-xl cursor-pointer"
          style={{
            zIndex: 10 - i,
          }}
          initial={{
            x: i * 60, // offset to the right
            y: i * 40, // offset down a bit
            scale: 1 - i * 0.05,
            rotate: i * 2, // slight rotation for realism
            opacity: 1 - i * 0.1,
          }}
          whileHover={{
            scale: 1.1,
            y: i * 10 - 10, // lift slightly
            rotate: 0,
            zIndex: 20, // bring forward
            opacity: 1,
            transition: { type: "spring", stiffness: 250, damping: 20 },
          }}
        />
      ))}
    </div>
  );
};

export default StackedImages;
