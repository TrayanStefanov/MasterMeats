import { IoCheckmarkCircle, IoHandLeftOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

const PurchaseSuccessModal = ({ order, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-primary/90 rounded-2xl shadow-xl shadow-accent/20 p-6 max-w-md w-full text-primary-content space-y-6">
        <div className="flex flex-col items-center gap-2">
          <IoCheckmarkCircle className="text-secondary w-16 h-16" />
          <h1 className="text-2xl font-bold text-accent text-center">
            {t("cart.paymentSuccess.title")}
          </h1>
          <p className="text-primary-content/80 text-center">
            {t("cart.paymentSuccess.subtitle")}
          </p>
        </div>

        {order && order.products && order.products.length > 0 && (
          <div className="bg-primary-content/10 rounded-xl p-4 space-y-2 text-sm">
            <h2 className="text-lg font-semibold">{t("cart.paymentSuccess.orderDetails.title")}</h2>
            <div className="flex justify-between">
              <span>{t("cart.paymentSuccess.orderDetails.orderId")}</span>
              <span className="text-secondary/50 font-semibold">#{order._id}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("cart.paymentSuccess.orderDetails.deliveryDate")}</span>
              <span className="text-secondary/50 font-semibold">
                {t("cart.paymentSuccess.orderDetails.deliveryText")}
              </span>
            </div>
            <div className="mt-2">
              <span className="font-semibold">{t("cart.paymentSuccess.orderDetails.items")}</span>
              <ul className="mt-1 list-disc list-inside">
                {order.products.map((p) => (
                  <li key={p.product._id}>
                    {p.quantity}{t("cart.kg")}  {t("cart.of")} {p.product.title} — €{p.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between font-bold border-t border-gray-700 pt-2 mt-2">
              <span>{t("cart.paymentSuccess.orderDetails.total")}</span>
              <span>€{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={onClose}
            className="w-full py-3 bg-accent/80 hover:bg-accent rounded-lg font-semibold flex justify-center items-center gap-2"
          >
            <IoHandLeftOutline size={18} />
            Thanks for trusting us!
          </button>
          <Link
            to="/"
            onClick={onClose}
            className="w-full py-3 bg-primary-content/10 hover:bg-primary-content/20 rounded-lg text-primary-content/80 hover:text-primary-content font-medium flex justify-center items-center gap-2"
          >
            {t("cart.paymentSuccess.btnClose")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessModal;
