import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import {FaShoppingBasket} from "react-icons/fa"
import { Link } from "react-router-dom";

import { useCartStore } from "../stores/useCartStore";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";

const CartModal = ({ isOpen, onClose }) => {
  const { cart } = useCartStore();

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-5xl bg-primary/90 border border-accent/20 
        rounded-2xl shadow-lg shadow-accent/10 text-primary-content p-6 md:p-8 
        overflow-y-auto max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-accent/70 hover:text-accent transition"
        >
          <IoClose size={26} />
        </button>

        <h2 className="text-3xl font-bold text-accent mb-2 text-center">
          Your Shopping Cart
        </h2>
        <p className="text-center text-primary-content/80 mb-8 text-sm">
          Review your items and complete your purchase
        </p>

        {cart.length === 0 ? (
          <EmptyCartUI />
        ) : (
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            <div className="flex-1 space-y-5">
              {cart.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>

            <div className="lg:w-[35%] space-y-6">
              <OrderSummary />
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default CartModal;

const EmptyCartUI = () => (
  <div className="flex flex-col items-center justify-center space-y-4 py-16">
    <FaShoppingBasket className="h-24 w-24 text-accent/40" />
    <h3 className="text-2xl font-semibold text-accent">Your cart is empty</h3>
    <p className="text-primary-content/70">
      Looks like you haven’t added anything yet.
    </p>
    <Link
      to="/"
      className="mt-4 rounded-lg bg-accent px-6 py-2 text-primary font-semibold 
                 hover:bg-accent/80 focus:ring-2 focus:ring-accent/50 
                 transition-all shadow-md shadow-accent/20"
    >
      Start Shopping
    </Link>
  </div>
);
