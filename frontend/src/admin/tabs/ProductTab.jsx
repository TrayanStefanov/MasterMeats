import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle, FaArrowLeft } from "react-icons/fa";

import { useProductStore } from "../../stores/useProductStore";
import ProductForm from "../components/ProductForm";
import ProductsList from "../components/ProductsList";

const ProductTab = () => {
  const { fetchAllProducts, products } = useProductStore();
  const [mode, setMode] = useState("list"); // "list" | "create" | "edit"
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const handleEdit = (product) => {
  // 🩹 Normalize image data
  const normalizedProduct = {
    ...product,
    images: product.images?.map((img) =>
      typeof img === "string" ? img : img.url
    ),
  };

  setSelectedProduct(normalizedProduct);
  setMode("edit");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

  const handleCreate = () => {
    setMode("create");
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = async () => {
    setMode("list");
    setSelectedProduct(null);
    await fetchAllProducts(); // refresh after create/update
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <AnimatePresence mode="wait">
        {mode === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-accent-content">Products</h2>
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 bg-accent text-accent-content px-4 py-2 rounded-xl hover:bg-accent/80 transition"
              >
                <FaPlusCircle /> Create Product
              </button>
            </div>

            <ProductsList products={products} onEdit={handleEdit} />
          </motion.div>
        )}

        {(mode === "create" || mode === "edit") && (
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={handleBack}
              className="mb-4 flex items-center gap-2 text-accent hover:underline"
            >
              <FaArrowLeft /> Back to Products
            </button>

            <ProductForm
              mode={mode}
              product={selectedProduct}
              onFinish={handleBack}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductTab;
