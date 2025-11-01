import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import { useProductStore } from "../../stores/useProductStore";

const ProductsList = ({ onEdit }) => {
  const { products, fetchAllProducts, deleteProduct, loading } = useProductStore();
  const { t : tAdminProducts} = useTranslation("admin/products");
  const { t : tCommon} = useTranslation("admin/common");
  const { t : tProducts} = useTranslation("productsSection");

  useEffect(() => {
    fetchAllProducts();

    const handleLangChange = () => fetchAllProducts();
    i18next.on("languageChanged", handleLangChange);

    return () => i18next.off("languageChanged", handleLangChange);
  }, [fetchAllProducts]);

  if (loading && products.length === 0) {
    return (
      <p className="text-center py-8 text-secondary/60">
        {tCommon("loading.loading")}
      </p>
    );
  }

  if (!products || products.length === 0) {
    return (
      <p className="text-center py-8 text-secondary/60">
        {tAdminProducts("empty")}
      </p>
    );
  }

  return (
    <motion.div
      className="bg-gray-800 shadow-xl rounded-lg overflow-hidden max-w-6xl mx-auto mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <table className="min-w-full divide-y divide-accent-content">
        <thead className="bg-secondary/80 font-semibold text-primary uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3 text-left text-xs">
              {tAdminProducts("list.name")}
            </th>
            <th className="px-6 py-3 text-left text-xs">
              {tAdminProducts("list.price")}
            </th>
            <th className="px-6 py-3 text-left text-xs">
              {tAdminProducts("list.category")}
            </th>
            <th className="px-6 py-3 text-right text-xs">
              {tAdminProducts("list.actions")}
            </th>
          </tr>
        </thead>

        <tbody className="bg-accent/70 divide-y divide-accent-content">
          {products.map((product) => {
            const firstImage =
              typeof product.images?.[0] === "string"
                ? product.images[0]
                : product.images?.[0]?.url ||
                  product.image ||
                  "/placeholder.png";

            const title = tProducts(`${product.name}.title`, {
              defaultValue: product.title?.en || product.name,
            });
            const description = tProducts(`${product.name}.description`, {
              defaultValue: product.description?.en || "",
            });

            return (
              <tr
                key={product._id}
                className="hover:bg-accent/90 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img
                        src={firstImage}
                        alt={title}
                        className="h-12 w-12 rounded-md object-cover border border-gray-600"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-secondary">
                        {title}
                      </div>
                      <div className="text-xs text-secondary/60 truncate max-w-[200px]">
                        {description || "—"}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary/60">
                    €{product.pricePerKg?.toFixed(2) || "—"}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary/60">
                    {product.category}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-middle">
                  <div className="flex justify-end items-center gap-3 h-full">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-accent-content/60 hover:text-accent-content transition-colors"
                    title={tCommon("buttons.updateProduct")}
                  >
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="text-accent-content/60 hover:text-accent-content transition-colors"
                    title={tCommon("buttons.deleteProduct")}
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProductsList;
