import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useReservationStore } from "../stores/useReservationStore";

const IRLReservationsList = ({ onEdit }) => {
  const {
    reservations,
    fetchFilteredReservations,
    deleteReservation,
    loading,
    filters,
    setFilter,
  } = useReservationStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchFilteredReservations();

    const handleLangChange = () => fetchFilteredReservations();
    i18next.on("languageChanged", handleLangChange);

    return () => i18next.off("languageChanged", handleLangChange);
  }, [fetchFilteredReservations]);

  const handleToggleCompleted = async (e) => {
    const showCompleted = e.target.checked ? "true" : "";
    setFilter("completed", showCompleted);
    await fetchFilteredReservations();
  };

  const handleToggleAmountDue = async (e) => {
    const hideZero = e.target.checked ? "nonzero" : "";
    setFilter("amountDue", hideZero);
    await fetchFilteredReservations();
  };

  // Apply amountDue filter on the frontend too (in case backend doesn’t filter)
  const filteredReservations =
    filters.amountDue === "nonzero"
      ? reservations.filter((r) => (r.amountDue || 0) > 0)
      : reservations;

  if (loading && reservations.length === 0) {
    return (
      <p className="text-center py-8 text-secondary/60">
        {t("common.loading")}
      </p>
    );
  }

  if (!filteredReservations || filteredReservations.length === 0) {
    return (
      <p className="text-center py-8 text-secondary/60">
        {t("common.noReservations")}
      </p>
    );
  }

  return (
    <motion.div
      className="bg-gray-800 shadow-xl rounded-lg overflow-hidden max-w-6xl mx-auto mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Filter Bar */}
      <div className="flex flex-wrap justify-between items-center gap-4 px-6 py-3 bg-secondary/40 border-b border-accent-content">
        <h2 className="text-lg font-semibold text-primary">
          {t("admin.reservations")}
        </h2>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.completed === "true"}
              onChange={handleToggleCompleted}
              className="checkbox checkbox-sm checkbox-accent"
            />
            <span>{t("admin.showCompleted") || "Show completed"}</span>
          </label>

          <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.amountDue === "nonzero"}
              onChange={handleToggleAmountDue}
              className="checkbox checkbox-sm checkbox-accent"
            />
            <span>{t("admin.hideZeroAmount") || "Hide €0 reservations"}</span>
          </label>
        </div>
      </div>

      <thead className="bg-secondary/50 font-semibold text-primary uppercase tracking-wider">
        <tr>
          <th className="px-6 py-3 text-left text-xs">{t("admin.client")}</th>
          <th className="px-6 py-3 text-left text-xs">{t("admin.products")}</th>
          <th className="px-6 py-3 text-left text-xs">
            {t("admin.totalAmount") || "Total (€)"}
          </th>
          <th className="px-6 py-3 text-left text-xs">
            {t("admin.amountDue") || "Due (€)"}
          </th>
          <th className="px-6 py-3 text-left text-xs">
            {t("admin.deliveryDate")}
          </th>
          <th className="px-6 py-3 text-left text-xs">{t("admin.status")}</th>
          <th className="px-6 py-3 text-right text-xs">{t("admin.actions")}</th>
        </tr>
      </thead>

      <tbody className="bg-accent/50 divide-y divide-accent-content">
        {filteredReservations.map((res) => (
          <tr key={res._id} className="hover:bg-accent/80 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
              {res.client?.name || "—"}
              <br />
              <span className="text-xs text-secondary/60">
                {res.client?.phone || "—"}
              </span>
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary/70">
              {res.products
                ?.map((p) => p.product?.name || "Unknown")
                .join(", ") || "—"}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary/60">
              €{res.calculatedTotalAmmount?.toFixed(2) || "0.00"}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <span
                className={
                  res.amountDue > 0
                    ? "text-red-400 font-semibold"
                    : "text-green-400 font-semibold"
                }
              >
                €{res.amountDue?.toFixed(2) || "0.00"}
              </span>
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary/60">
              {new Date(res.dateOfDelivery).toLocaleDateString()}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {res.completed ? (
                <span className="text-green-400 font-semibold">
                  {t("admin.completed")}
                </span>
              ) : (
                <span className="text-yellow-400 font-semibold">
                  {t("admin.pending")}
                </span>
              )}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
              <button
                onClick={() => onEdit && onEdit(res)}
                className="text-accent-content/60 hover:text-accent-content transition-colors"
              >
                <FaEdit className="h-5 w-5" />
              </button>
              <button
                onClick={() => deleteReservation(res._id)}
                className="text-accent-content/60 hover:text-accent-content transition-colors"
              >
                <FaTrash className="h-5 w-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </motion.div>
  );
};

export default IRLReservationsList;
