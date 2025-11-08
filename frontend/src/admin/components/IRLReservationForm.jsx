import { useState } from "react";
import { motion } from "framer-motion";
import { FaPlusCircle, FaSpinner, FaSave } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { useReservationStore } from "../stores/useReservationStore.js";

import ClientSearch from "./ClientSearch.jsx";
import ReservationItems from "./ReservationItems.jsx";
import DeliveryDetails from "./DeliveryDetails.jsx";

const IRLReservationForm = ({ mode = "create", reservation = null, onFinish }) => {
  const { createReservation, updateReservation, loading } = useReservationStore();

  const [client, setClient] = useState(
    reservation?.client || { name: "", phone: "", email: "", notes: "" }
  );
  const [products, setProducts] = useState(reservation?.products || []);
  const [details, setDetails] = useState({
    dateOfDelivery: reservation?.dateOfDelivery || "",
    notes: reservation?.notes || "",
    amountDue: reservation?.amountDue ?? 0,
    calculatedTotalAmmount: reservation?.calculatedTotalAmmount ?? 0,
    delivered: reservation?.delivered || false, 
  });
  
  const {t: tReservations} = useTranslation("admin/reservations");
  const {t: tCommon} = useTranslation("admin/common");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!client?._id) {
      toast.error("Please select a client before saving.");
      return;
    }

    const reservationData = {
      client: client._id,
      products,
      dateOfDelivery: details.dateOfDelivery,
      notes: details.notes,
      amountDue: Number(details.amountDue),
      calculatedTotalAmmount: Number(details.calculatedTotalAmmount),
      delivered: details.delivered, // Pass delivered, backend derives completed
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
        {mode === "edit" ? tReservations("editTitle") : tReservations("createTitle")}
      </h2>

      <form
        onSubmit={handleSubmit}
        className={`space-y-8 ${loading ? "opacity-75 pointer-events-none" : ""}`}
      >
        <ClientSearch onSelect={setClient} selectedClient={client} />
        <ReservationItems
          products={products}
          setProducts={setProducts}
          setDetails={setDetails}
        />
        <DeliveryDetails details={details} setDetails={setDetails} />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-accent text-accent-content font-medium rounded-xl shadow-md hover:bg-accent/80 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              {mode === "edit" ? tCommon("loading.updating") : tCommon("loading.creating")}
            </>
          ) : (
            <>
              {mode === "edit" ? <FaSave /> : <FaPlusCircle />}
              {mode === "edit" ? tCommon("buttons.updateReservation") : tCommon("buttons.createReservation")}
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default IRLReservationForm;
