import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(item._id, newQuantity);
  };

  return (
    <div className="bg-primary/90 border border-accent/20 rounded-2xl p-5 md:p-6 text-primary-content shadow-lg shadow-accent/10 transition-all hover:shadow-accent/20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="shrink-0 md:order-1">
          <img
            src={item.image}
            alt={item.name}
            className="h-20 w-20 md:h-28 md:w-28 rounded-xl object-cover border border-accent/30"
          />
        </div>

        <div className="flex-1 space-y-2 mt-4 md:mt-0 md:order-2 md:max-w-md">
          <p className="text-lg font-semibold text-accent hover:text-accent/80 transition">
            {item.name}
          </p>
          <p className="text-sm text-primary-content/70 line-clamp-2">
            {item.description}
          </p>

          <button
            onClick={() => removeFromCart(item._id)}
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 hover:underline transition"
          >
            <FaTrash size={14} />
            <span>Remove</span>
          </button>
        </div>

        <div className="flex items-center justify-between mt-4 md:mt-0 md:order-3 md:justify-end gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-accent/30 bg-primary-content/10 hover:bg-primary-content/20 focus:outline-none focus:ring-2 focus:ring-accent/50"
              aria-label="Decrease quantity"
            >
              <FaMinus className="text-accent w-3 h-3" />
            </button>

            <p className="text-primary-content font-semibold">{item.quantity}</p>

            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-accent/30 bg-primary-content/10 hover:bg-primary-content/20 focus:outline-none focus:ring-2 focus:ring-accent/50"
              aria-label="Increase quantity"
            >
              <FaPlus className="text-accent w-3 h-3" />
            </button>
          </div>
          <div className="text-right md:w-32">
            <p className="text-lg font-bold text-accent">
              ${item.price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
