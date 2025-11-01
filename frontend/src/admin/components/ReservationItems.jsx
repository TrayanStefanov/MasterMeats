import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useProductStore } from "../../stores/useProductStore.js";

const ReservationItem = ({ products, setProducts, setDetails }) => {
  const { products: allProducts, fetchAllProducts } = useProductStore();
  const { t: tCommon } = useTranslation("common");
  const { t: tACommon } = useTranslation("admin/common");
  const { t: tReservation } = useTranslation("admin/reservations");
  const { t: tProducts } = useTranslation("productsSection");
  const { t: tForms } = useTranslation("admin/forms");

  useEffect(() => {
    fetchAllProducts();

    const handleLangChange = () => fetchAllProducts();
    i18next.on("languageChanged", handleLangChange);
    return () => i18next.off("languageChanged", handleLangChange);
  }, [fetchAllProducts]);

  const handleAddProduct = (productId) => {
    const product = allProducts.find((p) => p._id === productId);
    if (!product) return;

    setProducts((prev) => [
      ...prev,
      {
        product: product._id,
        name: product.name,
        priceAtReservation: product.pricePerKg,
        quantityInGrams: 0,
      },
    ]);
  };

  const handleQuantityChange = (index, grams) => {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, quantityInGrams: Math.max(0, grams) } : p
      )
    );
  };

  const increment = (index) => {
    handleQuantityChange(index, products[index].quantityInGrams + 100);
  };

  const decrement = (index) => {
    handleQuantityChange(
      index,
      Math.max(0, products[index].quantityInGrams - 100)
    );
  };

  const handleRemove = (index) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = products.reduce(
    (acc, p) => acc + p.priceAtReservation * (p.quantityInGrams / 1000),
    0
  );

  useEffect(() => {
    setDetails((prev) => ({
      ...prev,
      calculatedTotalAmmount: totalAmount,
    }));
  }, [totalAmount, setDetails]);

  return (
    <div className="border-t-4 border-accent-content/60 pt-6">
      <h3 className="text-2xl font-semibold text-secondary text-center mb-4">
        {tReservation("title")}
      </h3>

      {/* Product Add Buttons */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {allProducts.map((p) => {
          const localizedName = tProducts(`${p.name}.title`, {
            defaultValue: p.name,
          });

          return (
            <button
              key={p._id}
              type="button"
              onClick={() => handleAddProduct(p._id)}
              className="px-3 py-1 bg-primary text-accent-content rounded-md hover:bg-primary/80 transition"
            >
              + {localizedName}
            </button>
          );
        })}
      </div>

      {/* No Products */}
      {products.length === 0 ? (
        <p className="text-center text-secondary/60">{tReservation("empty")}</p>
      ) : (
        <div className="space-y-3">
          {products.map((p, i) => {
            const localizedName = tProducts(`${p.name}.title`, {
              defaultValue: p.name,
            });

            return (
              <div
                key={i}
                className="flex flex-col md:flex-row md:items-center md:justify-between bg-secondary/50 p-3 rounded-lg border border-accent/20"
              >
                <div>
                  <p className="font-semibold text-secondary">
                    {localizedName}
                  </p>
                  <p className="text-sm text-secondary/70">
                    €{p.priceAtReservation.toFixed(2)} / {tCommon("units.kg")}
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-3 md:mt-0">
                  {/* Quantity Controller */}
                  <div className="flex items-center gap-1 lg:gap-2 border border-white/30 rounded-md overflow-hidden">
                    <button
                      type="button"
                      onClick={() => decrement(i)}
                      className="px-1 lg:px-3 py-1"
                    >
                      <FaMinus className="text-secondary w-3 h-3 lg:w-5 lg:h-5" />
                    </button>

                    <motion.span
                      key={p.quantityInGrams}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="p-1 text-base lg:text-lg 2xl:text-xl font-bold flex text-center"
                    >
                      {(p.quantityInGrams / 1000).toFixed(1)}{" "}
                      {tCommon("units.kg")}
                    </motion.span>

                    <button
                      type="button"
                      onClick={() => increment(i)}
                      className="px-1 lg:px-3"
                    >
                      <FaPlus className="text-secondary w-3 h-3 lg:w-5 lg:h-5" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(i)}
                    className="text-accent-content/70 hover:text-accent-content transition"
                    title={tACommon("buttons.deleteProduct")}
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
          <p className="text-right font-semibold text-secondary mt-4">
            {tForms("reservationItem.total")}: €{totalAmount.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReservationItem;
