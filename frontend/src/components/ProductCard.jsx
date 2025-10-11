import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { FaMinus, FaPlus } from "react-icons/fa";

import { useCartStore } from "../stores/useCartStore";
const ProductCard = ({ product, reverse = false }) => {
  // Quantity stored in grams internally
  const [quantityGrams, setQuantityGrams] = useState(500);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleBuy = async () => {
    if (!product._id) {
      toast.error("Product ID is missing");
      return;
    }
    try {
      await addToCart(product, quantityGrams); // Wait for request to finish
      toast.success(
        `${product.title} added (${(quantityGrams / 1000).toFixed(1)}kg)`
      );
    } catch (error) {
      toast.error("Failed to add product to cart");
    }
  };

  const increment = () => setQuantityGrams((prev) => prev + 100);
  const decrement = () => setQuantityGrams((prev) => (prev > 500 ? prev - 100 : 500));

  return (
    <motion.div
      className={`relative flex flex-col md:flex-row items-stretch rounded-3xl overflow-hidden transition-all duration-300 bg-accent ${reverse ? "md:flex-row-reverse" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Image section */}
      <div className="flex-1 relative p-4">
        <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover object-center"
          />
        </div>
        {product.badge && (
          <span className="absolute top-5 left-5 bg-accent text-primary-content px-4 py-1 text-xs font-bold uppercase rounded-full tracking-wider shadow-lg">
            {product.badge}
          </span>
        )}
      </div>

      {/* Text section */}
      <div className="flex-1 backdrop-blur-md text-white p-4 lg:p-8 flex flex-col justify-between relative z-10">
        <h3 className="text-2xl lg:text-4xl font-serif font-bold mx-4 lg:mx-8 mb-4 indent-4">
          {product.title}
        </h3>
        <p className="text-lg leading-relaxed mb-6 lg:mb-0 mx-4 lg:mx-8">
          {product.description}
        </p>

        <div className="flex items-center justify-between lg:justify-end gap-4 mx-4 lg:mx-8">
          <span className="text-2xl font-bold">€{product.pricePerKg}</span>

          <div className="flex items-center gap-2 border border-white/30 rounded-md overflow-hidden">
            <button onClick={decrement} className="px-3 py-1">
              <FaMinus className="text-white w-3 h-3" />
            </button>
            <span className="px-3 py-1">
              {(quantityGrams / 1000).toFixed(1)} kg
            </span>
            <button onClick={increment} className="px-3">
              <FaPlus className="text-white w-3 h-3" />
            </button>
          </div>

          <button
            onClick={handleBuy}
            className="border border-secondary px-6 py-2 rounded-full font-semibold hover:scale-105 transition-transform shadow-md"
          >
            {product.btnBuy}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
