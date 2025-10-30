import { useState } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { useCartStore } from "../stores/useCartStore";
import { useTranslation } from "react-i18next";

import CartItem from "./CartItem";
import CartModalEmpty from "./CartModalEmpty";
import OrderSummary from "./OrderSummary";
import PurchaseSuccessModal from "./PurchaseSuccessModal";
import PurchaseCancelModal from "./PurchaseCancelModal";

const CartModal = ({ isOpen, onClose }) => {
  const cart = useCartStore((state) => state.cart);
  const [order, setOrder] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const { t } = useTranslation("cart");

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
          className="relative w-[90%] max-w-6xl bg-primary/90 border-4 border-accent text-primary-content rounded-2xl shadow-lg shadow-accent/10 p-6 md:p-8 
            overflow-y-auto max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label="Close Cart Modal"
            className="absolute top-4 right-4 text-secondary/70 hover:text-accent transition"
          >
            <IoClose size={26} />
          </button>

          <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold text-accent mb-2 text-center">
            {t("title")}
          </h2>
          <p className="text-center text-primary-content/80 mb-8 text-sm lg:text-base 2xl:text-lg">
            {t("subtitle")}
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
              <div className="lg:w-[45%]">
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
