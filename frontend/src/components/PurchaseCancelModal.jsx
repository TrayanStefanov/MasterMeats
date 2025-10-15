import { createPortal } from "react-dom";

import { useTranslation } from "react-i18next";

const PurchaseCancelModal = ({ onClose }) => {
  const { t } = useTranslation();

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-secondary border-4 border-accent rounded-lg p-6 w-[90%] max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">{t("cart.paymentCancel.title")}</h2>
        <p className="mb-4">
          {t("cart.paymentCancel.subtitle")} <br />
          {t("cart.paymentCancel.subtitle2")}
        </p>
        <button
          onClick={onClose}
          className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/90 transition"
        >
          {t("cart.paymentCancel.btn")}
        </button>
      </div>
    </div>,
    document.body
  );
};

export default PurchaseCancelModal;
