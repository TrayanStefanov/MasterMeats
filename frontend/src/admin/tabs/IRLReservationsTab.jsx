import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle, FaArrowLeft } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import { useReservationStore } from "../stores/useReservationStore";
import IRLReservationsList from "../components/IRLReservationsList";
import IRLReservationForm from "../components/IRLReservationForm";

const IRLReservationsTab = () => {
  const { fetchFilteredReservations } = useReservationStore();
  const [mode, setMode] = useState("list"); // "list" | "create" | "edit"
  const [selectedReservation, setSelectedReservation] = useState(null);

  const { t: tReservations } = useTranslation("admin/reservations");
  const { t: tCommon } = useTranslation("admin/common");

  useEffect(() => {
    if (mode === "list") fetchFilteredReservations();
  }, [fetchFilteredReservations, mode]);

  const handleEdit = (reservation) => {
  // Map products to include productKey
  const mappedReservation = {
    ...reservation,
    products: reservation.products.map((p) => ({
      ...p,
      productKey: p.product?.name || p.product, // fallback to ID if name missing
    })),
  };

  setSelectedReservation(mappedReservation);
  setMode("edit");
  window.scrollTo({ top: 0, behavior: "smooth" });
};


  const handleCreate = () => {
    setSelectedReservation(null);
    setMode("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = async () => {
    setMode("list");
    setSelectedReservation(null);
    await fetchFilteredReservations(); // refresh after create/update
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <AnimatePresence mode="wait">
        {mode === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6 min-h-[60vh]"
          >
            <div className="flex justify-between px-8 items-center">
              <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-accent-content">
                {tReservations("tabs.irl")}
              </h2>
              <button
                onClick={handleCreate}
                className="flex items-center text-base lg:text-xl xl:text-2xl gap-2 bg-accent text-accent-content px-4 py-2 rounded-xl hover:bg-accent/80 transition"
              >
                <FaPlusCircle /> {tCommon("buttons.createReservation")}
              </button>
            </div>

            <IRLReservationsList onEdit={handleEdit} />
          </motion.div>
        )}

        {(mode === "create" || mode === "edit") && (
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[60vh]"
          >
            <button
              onClick={handleBack}
              className="mb-4 flex justify-center items-center gap-2 py-3 px-4 bg-accent text-accent-content font-medium rounded-xl shadow-md hover:bg-accent/80 transition disabled:opacity-50"
            >
              <FaArrowLeft /> {tReservations("back")}
            </button>

            <IRLReservationForm
              mode={mode}
              reservation={selectedReservation}
              onFinish={handleBack}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default IRLReservationsTab;
