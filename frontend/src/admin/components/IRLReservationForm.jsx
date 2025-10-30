import { useState } from "react";
import { motion } from "framer-motion";
import { FaPlusCircle, FaSpinner, FaSave } from "react-icons/fa";
import { useReservationStore } from "../stores/useReservationStore.js";

import ClientForm from "./ClientForm.jsx";
import ReservationItems from "./ReservationItems.jsx";
import DeliveryDetails from "./DeliveryDetails.jsx";

const ReservationForm = ({ mode = "create", reservation = null, onFinish }) => {
  const { createReservation, updateReservation, loading } = useReservationStore();

  const [client, setClient] = useState(
    reservation?.client || { name: "", phone: "", email: "", notes: "" }
  );
  const [products, setProducts] = useState(reservation?.products || []);
  const [details, setDetails] = useState({
  dateOfDelivery: reservation?.dateOfDelivery || "",
  notes: reservation?.notes || "",
  completed: reservation?.completed || false,
  amountDue: reservation?.amountDue ?? 0,
  calculatedTotalAmmount: reservation?.calculatedTotalAmmount ?? 0,
});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reservationData = {
  client,
  products,
  dateOfDelivery: details.dateOfDelivery,
  notes: details.notes,
  completed: details.completed,
  amountDue: Number(details.amountDue),
  calculatedTotalAmmount: Number(details.calculatedTotalAmmount),
};

    if (mode === "edit" && reservation?._id) {
      await updateReservation(reservation._id, reservationData);
    } else {
      await createReservation(reservationData);
    }

    if (typeof onFinish === "function") onFinish();
  };

  return (
    <motion.div
      className="p-8 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl lg:text-3xl font-semibold text-secondary text-center mb-6">
        {mode === "edit" ? "Edit Reservation" : "Create New Reservation"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className={`space-y-8 ${loading ? "opacity-75 pointer-events-none" : ""}`}
      >
        <ClientForm client={client} setClient={setClient} />
        <ReservationItems products={products} setProducts={setProducts} />
        <DeliveryDetails details={details} setDetails={setDetails} />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-accent text-accent-content font-medium rounded-xl shadow-md hover:bg-accent/80 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              {mode === "edit" ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              {mode === "edit" ? <FaSave /> : <FaPlusCircle />}
              {mode === "edit" ? "Update Reservation" : "Create Reservation"}
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default ReservationForm;
