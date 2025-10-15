import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { FaMinus, FaPlus } from "react-icons/fa";

import { useTranslation } from "react-i18next";

import { useCartStore } from "../stores/useCartStore";
import StackedImages from "./StackedImages";
const ProductCard = ({ product, reverse = false }) => {
  // Quantity stored in grams internally
  const [quantityGrams, setQuantityGrams] = useState(500);
  const addToCart = useCartStore((state) => state.addToCart);

  const { t } = useTranslation();
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
  const decrement = () =>
    setQuantityGrams((prev) => (prev > 500 ? prev - 100 : 500));

  return (
    <motion.div
      className={`flex h-[50vh] relative overflow-hidden transition-all duration-300`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Image layer-2nd layer */}
      <div
        className={`absolute flex w-full h-full mx-auto ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        }`}
      >
        {/* Image section */}
        <div className="w-[40vw] h-full self-center flex relative">
          <StackedImages
            images={[product.image, product.image, product.image]}
            reverse={reverse}
          />
        </div>
        <div className="min-w-[45%] max-w-[45%]"></div>
      </div>

      {/* innermost layer/ 3rd layer */}
      <div
        className={`w-[70%] h-[33vh] self-center mx-auto bg-accent/90 relative items-stretch rounded-3xl overflow-hidden flex ${
          reverse ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        {/* Text section */}
        <div className="self-end max-w-[60%] h-full text-secondary p-4 lg:p-8 justify-between relative z-10 flex flex-col">
          <div className="flex justify-between">
            <h3 className="text-2xl lg:text-4xl font-serif font-bold mx-4 lg:mx-8 mb-4 indent-4">
              {product.title}
            </h3>
            {product.badge && (
              <span className=" bg-accent text-primary-content content-center h-7 px-4 py-1 text-xs font-bold uppercase rounded-full tracking-wider shadow-lg whitespace-nowrap">
                {product.badge}
              </span>
            )}
          </div>
          <p className="text-lg leading-relaxed mb-6 lg:mb-0 mx-4 lg:mx-8">
            {product.description}
          </p>

          <p className="text-right w-1/2 text-sm leading-relaxed mb-6 lg:mb-0 mx-4 lg:mx-8 self-end">
            {product.ingredients}
          </p>

          <div className="flex items-center justify-between lg:justify-end gap-4 mx-4 lg:mx-8">
            <span className="text-3xl font-bold">€{product.pricePerKg}</span>

            <div className="flex items-center gap-2 border border-white/30 rounded-md overflow-hidden">
              <button onClick={decrement} className="px-3 py-1">
                <FaMinus className="text-secondary w-5 h-5" />
              </button>
              <motion.span
                key={quantityGrams}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="p-1 text-xl font-bold flex"
              >
                {(quantityGrams / 1000).toFixed(1)} {t("products.kg")}
              </motion.span>
              <button onClick={increment} className="px-3">
                <FaPlus className="text-secondary w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleBuy}
              className="border-4 border-secondary px-6 py-2 rounded-lg font-semibold hover:scale-110 transition-transform shadow-md"
            >
              {t("products.btnBuy")}
            </button>
          </div>
        </div>
        <div className="min-w-[45%]"></div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
