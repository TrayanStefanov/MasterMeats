import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import { useCartStore } from "../stores/useCartStore";
import StackedImages from "./StackedImages";
import MobileImageCarousel from "./MobileImageCarousel";

const ProductCard = ({ product, reverse = false }) => {
  const [quantityGrams, setQuantityGrams] = useState(500);
  const addToCart = useCartStore((state) => state.addToCart);
  const { t } = useTranslation();

  const handleBuy = async () => {
    if (!product._id) {
      toast.error("Product ID is missing");
      return;
    }
    await addToCart(product, quantityGrams);
  };

  const increment = () => setQuantityGrams((prev) => prev + 100);
  const decrement = () =>
    setQuantityGrams((prev) => (prev > 500 ? prev - 100 : 500));

  // ensure image array order is correct (top = first)
  const productImages =
    product.images && product.images.length > 0
      ? [...product.images].reverse() // reversed so index 0 is top
      : [product.image];

  const title = t(`products.${product.name}.title`, {
    defaultValue: product.name,
  });
  const description = t(`products.${product.name}.description`, {
    defaultValue: product.description || "",
  });
  const ingredients = t(`products.${product.name}.ingredients`, {
    defaultValue: "",
  });
  const badge = t(`products.${product.name}.badge`, { defaultValue: "" });

  return (
    <motion.div
      className={`flex flex-col lg:flex-row h-auto lg:h-[50vh] relative overflow-hidden transition-all duration-300`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Image layer */}
      <div
        className={`flex flex-col w-full lg:absolute justify-center lg:h-full lg:mx-auto ${
          reverse ? "lg:flex-row-reverse" : "lg:flex-row"
        }`}
      >
        <div className="hidden lg:flex lg:w-[45vw] xl:w-[50vw] 2xl:w-[55vw] h-full self-center relative">
          <StackedImages images={productImages} reverse={reverse} />
        </div>
        <div className="hidden lg:flex min-w-[45%] max-w-[45%]" />
      </div>

      {/* Card layer */}
      <div
        className={`w-full lg:w-[70%] lg:h-[80%] 2xl:h-[70%] self-center mx-auto bg-accent/90 relative items-stretch rounded-3xl overflow-hidden flex flex-col ${
          reverse ? "lg:flex-row" : "lg:flex-row-reverse"
        }`}
      >
        <div className="lg:hidden w-full">
          <MobileImageCarousel images={productImages} title={title} />
        </div>
        {/* Text section */}
        <div className="self-end max-w-full lg:max-w-[60%] h-full text-secondary p-4 lg:p-8 justify-between relative z-10 flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="text-xl lg:text-2xl 2xl:text-3xl font-serif font-bold mx-4 lg:mx-8 mb-4 indent-4">
              {title}
            </h3>
            {badge && (
              <span className="bg-accent text-primary-content h-7 px-4 py-1 text-xs font-bold uppercase rounded-full tracking-wider shadow-lg whitespace-nowrap">
                {badge}
              </span>
            )}
          </div>

          <p className="text-base lg:text-lg 2xl:text-xl leading-relaxed mb-6 lg:mb-0 mx-4 lg:mx-8">
            {description}
          </p>

          <p className="text-right w-full 2xl:w-1/2 text-sm lg:text-base leading-relaxed mb-6 lg:mb-3 mx-3 lg:mx-8 self-center lg:self-end">
            {ingredients}
          </p>

          <div className="flex items-center justify-between lg:justify-end gap-2 lg:gap-4 mx-2 2xl:mx-8">
            <span className="text-2xl lg:text-3xl font-bold">
              €{product.pricePerKg}
            </span>

            <div className="flex items-center gap-1 lg:gap-2 border border-white/30 rounded-md overflow-hidden">
              <button onClick={decrement} className="px-1 lg:px-3 py-1">
                <FaMinus className="text-secondary w-3 h-3 lg:w-5 lg:h-5" />
              </button>

              <motion.span
                key={quantityGrams}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="p-1 text-base lg:text-lg 2xl:text-xl font-bold flex text-center"
              >
                {(quantityGrams / 1000).toFixed(1)} {t("products.kg")}
              </motion.span>
              <button onClick={increment} className="px-1 lg:px-3">
                <FaPlus className="text-secondary w-3 h-3 lg:w-5 lg:h-5" />
              </button>
            </div>

            <button
              onClick={handleBuy}
              className="border lg:border-4 border-secondary 2xl:text-lg px-1 lg:px-3 py-2 rounded-lg font-semibold hover:scale-110 transition-transform shadow-md"
            >
              {t("products.btnBuy")}
            </button>
          </div>
        </div>
        <div className="hidden lg:block min-w-[45%]" />
      </div>
    </motion.div>
  );
};

export default ProductCard;
