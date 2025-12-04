import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaChevronDown, FaChevronUp  } from "react-icons/fa";
import { MdDone, MdDoneOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";
import i18next, { t } from "i18next";

import { useProductStore } from "../../stores/useProductStore";

const ProductsList = ({ onEdit }) => {
  const {
    products,
    fetchAdminProducts,
    toggleProductActive,
    deleteProduct,
    loading,
  } = useProductStore();
  const { t: tAdminProducts } = useTranslation("admin/products");
  const { t: tCommon } = useTranslation("admin/common");
  const { t: tProducts } = useTranslation("productsSection");

  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    fetchAdminProducts();

    const handleLangChange = () => fetchAdminProducts();
    i18next.on("languageChanged", handleLangChange);

    return () => i18next.off("languageChanged", handleLangChange);
  }, [fetchAdminProducts]);

  const handleToggleActive = async (productId, currentStatus) => {
    await toggleProductActive(productId, !currentStatus);
    fetchAdminProducts(); // refresh list after toggling
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

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
      <table className="min-w-full divide-y divide-accent-content hidden md:table">
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
            <th className="px-6 py-3 text-left text-xs">
              {tAdminProducts("list.stock")}
            </th>{" "}
            {/* new */}
            <th className="px-6 py-3 text-center text-xs">
              {tAdminProducts("list.isActive")}
            </th>{" "}
            {/* new */}
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

            return (
              <tr
                key={product._id}
                className="hover:bg-accent/90 transition-colors"
              >
                {/* Name & Image */}
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
                        {product.description?.en || "—"}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary/60">
                    €{product.pricePerKg?.toFixed(2) || "—"}
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary/60">
                    {tAdminProducts(
                      "admin/forms:product.categoryDropdown.categories." +
                        product.category,
                      { defaultValue: product.category }
                    )}
                  </div>
                </td>

                {/* Stock */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary/60">
                  {product.stockInGrams ?? 0} g
                </td>

                {/* Active Toggle */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <label
                    title={product.isActive ? tCommon("status.active") : tCommon("status.inactive")}
                    className={`inline-flex items-center cursor-pointer transition-colors ${
                      product.isActive
                        ? "text-accent-content"
                        : "text-accent-content/60 hover:text-accent-content"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={product.isActive}
                      onChange={() =>
                        handleToggleActive(product._id, product.isActive)
                      }
                      className="hidden"
                    />
                    <span
                      className={`w-5 h-5 flex items-center justify-center border rounded-md transition-colors
                      ${
                        product.isActive
                          ? "bg-accent-content border-accent-content text-primary"
                          : "bg-transparent border-accent-content text-accent-content/60 hover:text-accent-content"
                      }
                    `}
                      title={product.isActive ? tCommon("buttons.activate") : tCommon("buttons.deactivate")}
                    >
                      {product.isActive ? (
                        <MdDone className="h-4 w-4" />
                      ) : (
                        <MdDoneOutline className="h-4 w-4" />
                      )}
                    </span>
                  </label>
                </td>

                {/* Actions */}
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
      <div className="md:hidden space-y-4 p-2 bg-secondary">
        {products.map((product) => {
          const isExpanded = expandedRows.includes(product._id);
          const firstImage =
            typeof product.images?.[0] === "string"
              ? product.images[0]
              : product.images?.[0]?.url || product.image || "/placeholder.png";
          const title = tProducts(`${product.name}.title`, {
            defaultValue: product.title?.en || product.name,
          });

          return (
            <motion.div
              key={product._id}
              className="bg-accent rounded-lg overflow-hidden"
              layout
            >
              {/* Card Header */}
              <div className="flex items-center justify-between p-3 cursor-pointer">
                <div className="flex items-center gap-3">
                  <img
                    src={firstImage}
                    alt={title}
                    className="w-12 h-12 rounded-md object-cover border border-gray-600"
                  />
                  <div>
                    <div className="text-sm font-medium text-secondary">
                      {title}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={product.isActive}
                      onChange={() =>
                        handleToggleActive(product._id, product.isActive)
                      }
                      className="hidden"
                    />
                    <span
                      className={`w-5 h-5 flex items-center justify-center border rounded-md ${
                        product.isActive
                          ? "bg-accent-content border-accent-content text-primary"
                          : "bg-transparent border-accent-content text-accent-content/60 hover:text-accent-content"
                      }`}
                      title={product.isActive ? tCommon("buttons.activate") : tCommon("buttons.deactivate")}
                    >
                      {product.isActive ? (
                        <MdDone className="h-4 w-4" />
                      ) : (
                        <MdDoneOutline className="h-4 w-4" />
                      )}
                    </span>
                  </label>
                  <button
                    onClick={() => onEdit(product)}
                    className="text-accent-content/60 hover:text-accent-content"
                    title={tCommon("buttons.updateProduct")}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="text-accent-content/60 hover:text-accent-content"
                    title={tCommon("buttons.deleteProduct")}
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => toggleExpand(product._id)}
                    className="text-accent-content/60 hover:text-accent-content"
                    title={isExpanded ? tCommon("buttons.hideDetails") : tCommon("buttons.showDetails")}
                  >
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>

              {/* Expandable Info */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    key={`${product._id}-details`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="bg-primary/40 px-4 py-2 text-secondary/80 text-sm"
                  >
                    <p>{tAdminProducts("list.price")}: €{product.pricePerKg?.toFixed(2) || "—"}</p>
                    <p>{tAdminProducts("list.category")}: {product.category}</p>
                    <p>{tAdminProducts("list.stock")}: {product.stockInGrams ?? 0} g</p>
                    <p>{tAdminProducts("list.description")}: {product.description?.en || "—"}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ProductsList;
