import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useProductStore } from "../stores/useProductStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const ProductsList = () => {
  const { products, fetchAllProducts, deleteProduct, loading } = useProductStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();

    const handleLangChange = () => fetchAllProducts();
    i18next.on("languageChanged", handleLangChange);

    return () => i18next.off("languageChanged", handleLangChange);
  }, [fetchAllProducts]);

  if (loading && products.length === 0) {
    return <p className="text-center py-8 text-secondary/60">{t("common.loading")}</p>;
  }

  if (!products || products.length === 0) {
    return <p className="text-center py-8 text-secondary/60">{t("common.noProducts")}</p>;
  }

  return (
    <motion.div
      className="bg-gray-800 shadow-xl rounded-lg overflow-hidden max-w-6xl mx-auto mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
              {t("admin.product")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
              {t("admin.pricePerKg")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
              {t("admin.category")}
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
              {t("admin.actions")}
            </th>
          </tr>
        </thead>

        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {products.map((product) => {
            const firstImage =
              product.images?.[0] || product.image || "/placeholder.png";

            const title = t(`products.${product.name}.title`, {
              defaultValue: product.name,
            });
            const description = t(`products.${product.name}.description`, {
              defaultValue: product.description || "",
            });

            return (
              <tr key={product._id} className="hover:bg-gray-700 transition-colors">
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
                      <div className="text-sm font-medium text-white">{title}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[200px]">
                        {description || "—"}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    €{product.pricePerKg?.toFixed(2) || "—"}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {product.category || t("admin.uncategorized")}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                  <button
                    onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    title={t("admin.editProduct")}
                  >
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
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
