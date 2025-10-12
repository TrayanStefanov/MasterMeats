import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { loadStripe } from "@stripe/stripe-js";
import {Elements, CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import axios from "../lib/axios";
import { useCartStore } from "../stores/useCartStore";
import { useSmoothScrollNav } from "../hooks/useSmoothScrollNav";

const stripePromise = loadStripe(
  "pk_test_51S0odII9slnLG2ht6hVJGDyVLleTQIcqTIPFbdYUE7NBgJwoi4R6Myeq4ZmdeeGmYC06YDD9D4I42Fj5fE0MAguw00s5SopSI1"
);

const CheckoutForm = ({ onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { scrollToSection } = useSmoothScrollNav([{ href: "#products" }], onClose);

  const { total, subtotal, coupon, isCouponApplied, cart, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post("/payments/create-payment-intent", {
        products: cart,
        couponCode: coupon ? coupon.code : null,
      });

      const clientSecret = data.clientSecret;

      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        console.error(result.error.message);
        setError(result.error.message);

        if (
          result.error.type === "card_error" ||
          result.error.type === "validation_error"
        ) {
          window.location.href = "/purchase-cancel";
        }
      } else if (result.paymentIntent.status === "succeeded") {
        clearCart();
        window.location.href = "/purchase-success";
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error occurred. Please try again.");
      window.location.href = "/purchase-cancel";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between bg-primary/90 text-primary-content rounded-xl p-6 lg:h-full">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Order Summary</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Original price</span>
            <span className="text-white">${formattedSubtotal}</span>
          </div>

          {savings > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-300">Savings</span>
              <span className="text-white">-${formattedSavings}</span>
            </div>
          )}

          {coupon && isCouponApplied && (
            <div className="flex justify-between">
              <span className="text-gray-300">Coupon ({coupon.code})</span>
              <span className="text-white">-{coupon.discountPercentage}%</span>
            </div>
          )}

          <div className="flex justify-between font-bold border-t border-gray-700 pt-2">
            <span className="text-white">Total</span>
            <span className="text-white">${formattedTotal}</span>
          </div>
        </div>

        <div className="mt-4">
          <CardElement className="p-2 rounded-md bg-primary-content/10 text-primary-content" />
          {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={handlePayment}
          disabled={!stripe || loading}
          className="w-full py-3 bg-accent/80 hover:bg-accent rounded-lg text-primary font-semibold transition-shadow shadow-md shadow-accent/20 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Proceed to Checkout"}
        </button>

        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("#products");
          }}
          className="flex items-center justify-center gap-1 text-primary-content/80 hover:text-primary underline text-sm font-medium"
        >
          Continue Shopping <FaArrowRightLong size={16} />
        </Link>
      </div>
    </div>
  );
};

const OrderSummary = ({ onClose }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm onClose={onClose} />
  </Elements>
);

export default OrderSummary;
