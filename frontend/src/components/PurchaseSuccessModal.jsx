import { IoCheckmarkCircle, IoHandLeftOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const PurchaseSuccessModal = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-primary/90 rounded-2xl shadow-xl shadow-accent/20 p-6 max-w-md w-full text-primary-content space-y-6">
        <div className="flex flex-col items-center gap-2">
          <IoCheckmarkCircle className="text-accent w-16 h-16" />
          <h1 className="text-2xl font-bold text-accent text-center">
            Purchase Successful!
          </h1>
          <p className="text-primary-content/80 text-center">
            Thank you for your order. We're processing it now.
          </p>
        </div>

        {order && order.products && order.products.length > 0 && (
          <div className="bg-primary-content/10 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Order number</span>
              <span className="text-accent font-semibold">#{order._id}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated delivery</span>
              <span className="text-accent font-semibold">
                3–5 business days
              </span>
            </div>
            <div className="mt-2">
              <span className="font-semibold">Items:</span>
              <ul className="mt-1 list-disc list-inside">
                {order.products.map((p) => (
                  <li key={p.product._id}>
                    {p.quantity}g of {p.product.title} — €{p.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between font-bold border-t border-gray-700 pt-2 mt-2">
              <span>Total</span>
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
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessModal;
