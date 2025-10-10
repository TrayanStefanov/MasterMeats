import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";


const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const handlePayment = async () => {
    try {
      // Make a payment request to your payment gateway here
      console.log("Payment successful!");
    } catch (error) {
      console.error("Payment error:", error);
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
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={handlePayment}
          className="w-full py-3 bg-accent/80 hover:bg-accent rounded-lg text-primary font-semibold transition-shadow shadow-md shadow-accent/20"
        >
          Proceed to Checkout
        </button>

        <Link
          to="/#products"
          className="flex items-center justify-center gap-1 text-primary-content/80 hover:text-primary underline text-sm font-medium"
        >
          Continue Shopping <FaArrowRightLong size={16} />
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;
