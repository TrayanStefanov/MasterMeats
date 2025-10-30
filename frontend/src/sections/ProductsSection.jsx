import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import ProductCard from "../components/ProductCard.jsx";
import { useProductStore } from "../stores/useProductStore.js";

const ProductsSection = () => {
  const { t } = useTranslation("productsSection");
  const { products, fetchAllProducts, loading } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts, t]);

  return (
    <section id="products" className="py-4">
      <div className="container mx-auto text-center mb-16">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-accent px-6 lg:px-0 my-2">
          {t("title")}
        </h2>
        <div className="w-1/2 h-[3px] bg-accent mx-auto rounded-full"></div>
      </div>

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      <motion.div
        className="container mx-auto flex flex-col gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
      >
        {products.map((product, idx) => (
          <ProductCard
            key={product._id}
            product={product}
            reverse={idx % 2 === 1}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default ProductsSection;
