import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import { useProductStore } from "../../stores/useProductStore";

const ProductsList = ({ onEdit }) => {
  const { products, fetchAllProducts, deleteProduct, loading } = useProductStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchAllProducts();

    const handleLangChange = () => fetchAllProducts();
    i18next.on("languageChanged", handleLangChange);

    return () => i18next.off("languageChanged", handleLangChange);
  }, [fetchAllProducts]);

  if (loading && products.length === 0) {
    return (
      <p className="text-center py-8 text-secondary/60">
        {t("common.loading")}
      </p>
    );
  }

  if (!products || products.length === 0) {
    return (
      <p className="text-center py-8 text-secondary/60">
        {t("common.noProducts")}
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
        <thead className="bg-secondary/50 font-semibold text-primary uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3 text-left text-xs">
              {t("admin.product")}
            </th>
            <th className="px-6 py-3 text-left text-xs">
              {t("admin.pricePerKg")}
            </th>
            <th className="px-6 py-3 text-left text-xs">
              {t("admin.category")}
            </th>
            <th className="px-6 py-3 text-right text-xs">
              {t("admin.actions")}
            </th>
          </tr>
        </thead>

        <tbody className="bg-accent/50 divide-y divide-accent-content">
          {products.map((product) => {
            const firstImage =
              typeof product.images?.[0] === "string"
                ? product.images[0]
                : product.images?.[0]?.url ||
                  product.image ||
                  "/placeholder.png";

            const title = t(`products.${product.name}.title`, {
              defaultValue: product.title?.en || product.name,
            });
            const description = t(`products.${product.name}.description`, {
              defaultValue: product.description?.en || "",
            });

            return (
              <tr
                key={product._id}
                className="hover:bg-accent/80 transition-colors"
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
                    {product.category || t("admin.uncategorized")}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-accent-content/60 hover:text-accent-content transition-colors"
                    title={t("admin.editProduct")}
                  >
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="text-accent-content/60 hover:text-accent-content transition-colors"
                    title={t("admin.deleteProduct")}
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
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
