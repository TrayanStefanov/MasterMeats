import { IoCheckmarkCircle, IoHandLeftOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PurchaseSuccessModal = ({ order, onClose }) => {
  const { t: tCart } = useTranslation("cart");
  const { t: tProducts } = useTranslation("productsSection");
  const { t: tCommon } = useTranslation("common");

  const getLocalizedTitle = (product) => {
    // Use product.key first, fallback to name or _id
    const productKey = product.key || product.name || product._id;
    const i18nData = tProducts(`${productKey}`, { returnObjects: true });
    return i18nData?.title || product.title || productKey;
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-primary/90 rounded-2xl shadow-xl shadow-accent/20 p-6 max-w-md w-full text-primary-content space-y-6">
        <div className="flex flex-col items-center gap-2">
          <IoCheckmarkCircle className="text-secondary w-16 h-16" />
          <h1 className="text-xl lg:text-2xl 2xl:text-3xl font-bold text-accent text-center">
            {tCart("paymentSuccess.title")}
          </h1>
          <p className="text-base lg:text-lg 2xl:text-xl text-primary-content/80 text-center">
            {tCart("paymentSuccess.subtitle")}
          </p>
        </div>

        {order?.products?.length > 0 && (
          <div className="bg-primary-content/10 rounded-xl p-4 space-y-2 text-sm">
            <h2 className="text-sm lg:text-base 2xl:text-lg font-semibold text-center">
              {tCart("paymentSuccess.orderDetails.title")}
            </h2>

            <div className="flex justify-between items-center">
              <span>{tCart("paymentSuccess.orderDetails.orderId")}</span>
              <span className="text-secondary/50 font-semibold">
                #{order._id}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>{tCart("paymentSuccess.orderDetails.deliveryDate")}</span>
              <span className="text-secondary/50 font-semibold">
                {tCart("paymentSuccess.orderDetails.deliveryText")}
              </span>
            </div>

            <div className="mt-2">
              <span className="font-semibold">
                {tCart("paymentSuccess.orderDetails.items")}
              </span>
              <ul className="mt-1 list-disc list-inside">
                {order.products.map((p) => {
                  const localizedTitle = getLocalizedTitle(p.product);
                  return (
                    <li key={p.product._id}>
                      {p.quantityInGrams / 1000}
                      {tCommon("units.kg")} {tCommon("units.of")} {localizedTitle} — €
                      {p.price.toFixed(2)}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex justify-between font-bold border-t border-gray-700 pt-2 mt-2">
              <span>{tCart("paymentSuccess.orderDetails.total")}</span>
              <span>€{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            onClick={onClose}
            className="w-full py-3 bg-primary-content/10 hover:bg-primary-content/20 rounded-lg text-primary-content/80 hover:text-primary-content font-medium flex justify-center items-center gap-2"
          >
            <IoHandLeftOutline size={18} />
            {tCart("paymentSuccess.btnClose")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessModal;
