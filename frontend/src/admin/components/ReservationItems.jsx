import { useProductStore } from "../../stores/useProductStore.js";
import { use, useEffect } from "react";
import { useTranslation } from "react-i18next";

const ReservationItem = ({ products, setProducts }) => {
  const { products: allProducts, fetchAllProducts } = useProductStore();
  const {t: tCommon} = useTranslation("common"); 
  const {t: tReservation} = useTranslation("admin/reservations");

  useEffect(() => {
    if (!allProducts.length) fetchAllProducts();
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
        quantityInGrams: 1000,
      },
    ]);
  };

  const handleQuantityChange = (index, quantity) => {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, quantityInGrams: Number(quantity) } : p
      )
    );
  };

  const handleRemove = (index) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t-4 border-accent-content/60 pt-6">
      <h3 className="text-2xl font-semibold text-secondary text-center mb-4">
        {tReservation("title")}
      </h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {allProducts.map((p) => (
          <button
            key={p._id}
            type="button"
            onClick={() => handleAddProduct(p._id)}
            className="px-3 py-1 bg-primary text-accent-content rounded-md hover:bg-primary/80 transition"
          >
            + {p.name}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-center text-secondary/60">{tReservation("empty")}</p>
      ) : (
        <div className="space-y-3">
          {products.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg border border-accent/20"
            >
              <div>
                <p className="font-semibold text-secondary">{p.name}</p>
                <p className="text-sm text-secondary/70">
                  €{p.priceAtReservation.toFixed(2)} /{tCommon("units.kg")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={p.quantityInGrams}
                  onChange={(e) => handleQuantityChange(i, e.target.value)}
                  className="w-24 p-2 rounded-md bg-primary text-accent-content border border-accent/20"
                  min="0"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="text-accent-content/70 hover:text-accent-content transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationItem;
