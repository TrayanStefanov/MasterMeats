import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe("pk_test_51S0odII9slnLG2ht6hVJGDyVLleTQIcqTIPFbdYUE7NBgJwoi4R6Myeq4ZmdeeGmYC06YDD9D4I42Fj5fE0MAguw00s5SopSI1");

const OrderSummary = ({ onPaymentSuccess, onPaymentCancel }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm onPaymentSuccess={onPaymentSuccess} onPaymentCancel={onPaymentCancel} />
  </Elements>
);

export default OrderSummary;
