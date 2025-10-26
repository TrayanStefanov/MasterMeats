import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useCartStore } from "../stores/useCartStore";
import { useTranslation } from "react-i18next";

const CartItem = ({ item }) => {
  const { t } = useTranslation();
  const { removeFromCart, updateQuantity } = useCartStore();

  const keyBase = item.slug || item.name?.toLowerCase().replace(/\s+/g, "_") || item._id;

  const title = t(`products.${keyBase}.title`, { defaultValue: item.title || "Unnamed Product" });
  const description = t(`products.${keyBase}.description`, {
    defaultValue: item.description || "No description available.",
  });

  const imageSrc =
  Array.isArray(item.images) && item.images.length > 0
    ? typeof item.images[0] === "string"
      ? item.images[0]
      : item.images[0]?.url
    : item.image || "/placeholder.png";

  // Convert grams to kg for display
  const quantityKg = (item.quantityInGrams ?? 0) / 1000;

  // Adjust quantity in 0.1 kg increments (internally in grams)
  const handleQuantityChange = (deltaKg) => {
    const deltaGrams = Math.round(deltaKg * 1000);
    const newQuantityGrams = (item.quantityInGrams ?? 0) + deltaGrams;
    if (newQuantityGrams < 500) return; // Minimum 500g
    updateQuantity(item._id, newQuantityGrams);
  };
  // Calculate total price in euros
  const totalPrice = ((item.pricePerKg ?? 0) * quantityKg).toFixed(2);

  return (
    <div className="bg-primary/90 border-4 border-accent text-primary-content rounded-2xl p-5 md:p-6 shadow-lg shadow-accent/10 transition-all hover:shadow-accent/20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="shrink-0 md:order-1">
          <img
            src={imageSrc}
            alt={title}
            className="h-20 w-20 md:h-28 md:w-28 rounded-xl object-cover border border-accent/30"
          />
        </div>

        <div className="flex-1 space-y-2 mt-4 md:mt-0 md:order-2 md:max-w-md">
          <p className="text-lg lg:text-xl 2xl:text-2xl font-semibold text-accent hover:text-accent/80 transition">
            {title}
          </p>
          <p className="text-xs lg:text-sm 2xl:text-base text-primary-content/70 line-clamp-2">
            {description}
          </p>

          <button
            onClick={() => removeFromCart(item._id)}
            className="inline-flex items-center gap-1 text-sm lg:text-base 2xl:text-lg font-medium text-accent hover:text-accent/80 hover:underline transition"
          >
            <FaTrash className="w-4 h-4" size={14} />
            <span>{t("cart.removeItem")}</span>
          </button>
        </div>

        <div className="flex flex-col items-center justify-between mt-4 md:mt-0 md:order-3 md:justify-end gap-4">
          <div className="flex items-center gap-3">
            <span className="text-base lg:text-lg 2xl:text-xl font-bold">
              €{item.pricePerKg}
            </span>
            <button
              onClick={() => handleQuantityChange(-0.1)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-accent/30 bg-primary-content/10 hover:bg-primary-content/20 focus:outline-none focus:ring-2 focus:ring-accent/50"
              aria-label="Decrease quantity"
            >
              <FaMinus className="text-accent w-3 h-3" />
            </button>

            <p className="text-primary-content text-base lg:text-lg 2xl:text-xl font-semibold">
              {quantityKg.toFixed(1)} {t("cart.kg")}
            </p>

            <button
              onClick={() => handleQuantityChange(0.1)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-accent/30 bg-primary-content/10 hover:bg-primary-content/20 focus:outline-none focus:ring-2 focus:ring-accent/50"
              aria-label="Increase quantity"
            >
              <FaPlus className="text-accent w-3 h-3" />
            </button>
          </div>
          <div className="text-right md:w-32">
            <p className="text-lg lg:text-xl 2xl:text-2xl font-bold text-accent">
              €{totalPrice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
