import { IoCloseCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
  return (
    <div className="h-screen flex items-center justify-center px-4 bg-primary/90">
      <div className="max-w-md w-full bg-primary/90 rounded-2xl shadow-xl shadow-accent/20 p-6 space-y-6 text-primary-content">
        <div className="flex flex-col items-center gap-2">
          <IoCloseCircleOutline className="text-accent w-16 h-16" />
          <h1 className="text-2xl font-bold text-accent text-center">
            Payment Cancelled
          </h1>
          <p className="text-primary-content/80 text-center">
            Your payment was not completed. You can retry or continue shopping.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="w-full py-3 bg-accent/80 hover:bg-accent rounded-lg font-semibold shadow-md shadow-accent/20 flex justify-center items-center"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCancelPage;
