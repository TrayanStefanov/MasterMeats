import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ReservationDetailsModal = ({ reservation, onClose }) => {
  const { t: tReservations } = useTranslation("admin/reservations");
  const { t: tProducts } = useTranslation("productsSection");
  const { t: tCommon } = useTranslation("admin/common");

  if (!reservation) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl shadow-lg relative border border-accent/30"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-secondary/60 hover:text-secondary transition-colors"
          >
            <FaTimes />
          </button>

          {/* Title */}
          <h3 className="text-center text-secondary font-semibold text-lg mb-4 border-b border-accent/40 pb-2">
            {tReservations("details.title", {
              defaultValue: "Reservation Details",
            })}
          </h3>

          {/* Date + Status */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-secondary/70">
              <strong>
                {tReservations("details.reservationDate", {
                  defaultValue: "Date",
                })}
                :
              </strong>{" "}
              {new Date(reservation.dateOfDelivery).toLocaleDateString()}
            </p>
            <p className="text-secondary/70">
              <strong>
                {tCommon("status.status", { defaultValue: "Status" })}:
              </strong>{" "}
              <span
                className={`font-semibold rounded-md px-2 py-1 ${
                  reservation.status === "completed"
                    ? "bg-green-500/80 text-white"
                    : reservation.status === "reserved"
                    ? "bg-blue-500/80 text-white"
                    : reservation.status === "deliveredNotPaid"
                    ? "bg-red-500/80 text-white"
                    : reservation.status === "paidNotDelivered"
                    ? "bg-yellow-500/80 text-white"
                    : "text-secondary/50"
                }`}
              >
                {tCommon(`status.${reservation.status}`, {
                  defaultValue: reservation.status,
                })}
              </span>
            </p>
          </div>

          {/* Products List */}
          <div>
            <h4 className="text-secondary font-semibold mb-2 text-sm uppercase tracking-wide">
              {tReservations("details.itemList", { defaultValue: "Products" })}
            </h4>
            <div className="space-y-1 bg-primary p-3 rounded-lg border border-accent/30">
              {reservation.products?.length ? (
                reservation.products.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-secondary/70 text-sm"
                  >
                    <span>
                      {tProducts(`${p.product?.name}.title`, {
                        defaultValue: p.product?.name || "—",
                      })}{" "}
                      ({p.quantityInGrams} g)
                    </span>
                    <span className="text-secondary/50">
                      €{p.priceAtReservation?.toFixed(2) ?? "0.00"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-secondary/40 italic">
                  {tReservations("details.noProducts", {
                    defaultValue: "No products",
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="mt-4">
            <h4 className="text-secondary font-semibold mb-2 text-sm uppercase tracking-wide">
              {tReservations("details.notes", { defaultValue: "Notes" })}
            </h4>
            <div className="bg-primary p-3 rounded-lg border border-accent/30 min-h-[100px]">
              {reservation.notes ? (
                <p className="text-secondary/70 leading-relaxed whitespace-pre-wrap">
                  {reservation.notes}
                </p>
              ) : (
                <p className="text-secondary/40 italic">
                  {tReservations("details.noNotes", {
                    defaultValue: "No notes provided.",
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Totals */}
          <div className="mt-4 text-secondary/70 text-sm border-t border-accent/30 pt-3">
            <p>
              <strong>
                {tReservations("details.totalAmount", {
                  defaultValue: "Total",
                })}
                :
              </strong>{" "}
              €{reservation.calculatedTotalAmount?.toFixed(2) ?? "—"}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReservationDetailsModal;
