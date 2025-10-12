import { IoCheckmarkCircle, IoHandLeftOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";

const PurchaseSuccessPage = () => {
  const { clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLastOrder = async () => {
      try {
        const res = await axios.get("/orders/last", { withCredentials: true });
        setOrder(res.data.order);

        // Clear cart frontend-side
        clearCart();
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.error || "Failed to load your order. Please contact support."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLastOrder();
  }, [clearCart]);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center text-primary-content">
        Processing your order...
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-400">
        Error: {error}
      </div>
    );

  return (
    <div className="h-screen flex items-center justify-center px-4 bg-primary/90">
      <div className="max-w-md w-full bg-primary/90 rounded-2xl shadow-xl shadow-accent/20 p-6 space-y-6 text-primary-content">
        <div className="flex flex-col items-center gap-2">
          <IoCheckmarkCircle className="text-accent w-16 h-16" />
          <h1 className="text-2xl font-bold text-accent text-center">
            Purchase Successful!
          </h1>
          <p className="text-primary-content/80 text-center">
            Thank you for your order. We're processing it now.
          </p>
        </div>

        {order && (
          <div className="bg-primary-content/10 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-primary-content/70">
              <span>Order number</span>
              <span className="text-accent font-semibold">#{order._id}</span>
            </div>
            <div className="flex justify-between text-sm text-primary-content/70">
              <span>Estimated delivery</span>
              <span className="text-accent font-semibold">3-5 business days</span>
            </div>
            <div className="mt-2 text-sm">
              <span className="font-semibold">Items:</span>
              <ul className="mt-1 list-disc list-inside">
                {order.products.map((p) => (
                  <li key={p.product._id}>
                    {p.quantity}g of {p.product.name} — €{p.price.toFixed(2)}
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

        <div className="flex flex-col gap-3 mt-4">
          <button className="w-full py-3 bg-accent/80 hover:bg-accent rounded-lg font-semibold shadow-md shadow-accent/20 flex justify-center items-center gap-2">
            <IoHandLeftOutline size={18} />
            Thanks for trusting us!
          </button>

          <Link
            to="/"
            className="w-full py-3 bg-primary-content/10 hover:bg-primary-content/20 rounded-lg text-primary-content/80 hover:text-primary-content font-medium flex justify-center items-center gap-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
