import { useState } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { useCartStore } from "../stores/useCartStore";
import CartItem from "../components/CartItem";
import CartModalEmpty from "../components/CartModalEmpty";
import OrderSummary from "../components/OrderSummary";
import PurchaseSuccessModal from "../components/PurchaseSuccessModal";
import PurchaseCancelModal from "../components/PurchaseCancelModal";

const CartModal = ({ isOpen, onClose }) => {
  const cart = useCartStore((state) => state.cart);
  const [order, setOrder] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose(); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelClose = () => setShowCancel(false);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative w-[90%] bg-primary/90 border border-accent/20 
            rounded-2xl shadow-lg shadow-accent/10 text-primary-content p-6 md:p-8 
            overflow-y-auto max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label="Close Cart Modal"
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
            <CartModalEmpty onClose={onClose} />
          ) : (
            <div className="flex flex-col lg:flex-row lg:items-start gap-8">
              <div className="space-y-6 overflow-y-auto max-h-[60vh] lg:max-h-[70vh]">
                {cart.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
              <div className="lg:w-[35%]">
                <OrderSummary
                  onPaymentSuccess={(orderData) => {
                    setOrder(orderData);
                    setShowSuccess(true);
                  }}
                  onPaymentCancel={() => setShowCancel(true)} 
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <PurchaseSuccessModal order={order} onClose={handleSuccessClose} />
      )}

      {/* Cancel Modal */}
      {showCancel && <PurchaseCancelModal onClose={handleCancelClose} />}
    </>,
    document.body
  );
};

export default CartModal;
