import { createPortal } from "react-dom";

const PurchaseCancelModal = ({ onClose }) => {
  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-secondary border-4 border-accent rounded-lg p-6 w-[90%] max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Payment Failed</h2>
        <p className="mb-4">
          There was an issue processing your payment. <br />
          Please try again.
        </p>
        <button
          onClick={onClose}
          className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/90 transition"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};

export default PurchaseCancelModal;
