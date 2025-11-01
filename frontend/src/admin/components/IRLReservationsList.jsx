import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrash,
  FaEdit,
  FaPhoneAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
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

  const { t: tCommon } = useTranslation("admin/common");
  const { t: tReservations } = useTranslation("admin/reservations");
  const { t: tProducts } = useTranslation("productsSection");

  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    fetchFilteredReservations();
    const handleLangChange = () => fetchFilteredReservations();
    i18next.on("languageChanged", handleLangChange);
    return () => i18next.off("languageChanged", handleLangChange);
  }, [fetchFilteredReservations]);

  // ✅ Toggle row expansion
  const toggleExpand = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ COMPLETED TOGGLE FIX
  const handleToggleCompleted = async (e) => {
    const showOnlyCompleted = e.target.checked ? "true" : "";
    setFilter("completed", showOnlyCompleted);
    await fetchFilteredReservations();
  };

  // ✅ Amount due filter unchanged
  const handleToggleAmountDue = async (e) => {
    const hideZero = e.target.checked ? "nonzero" : "";
    setFilter("amountDue", hideZero);
    await fetchFilteredReservations();
  };

  // ✅ Apply amountDue filter locally
  const filteredReservations =
    filters.amountDue === "nonzero"
      ? reservations.filter((r) => (r.amountDue || 0) > 0)
      : reservations;

  if (loading && reservations.length === 0) {
    return (
      <p className="text-center py-8 text-secondary/60">
        {tCommon("loading.loading")}
      </p>
    );
  }

  if (!filteredReservations || filteredReservations.length === 0) {
    return (
      <p className="text-center py-8 text-secondary/60">
        {tReservations("empty")}
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
      <div className="flex flex-wrap justify-between items-center gap-4 px-6 py-3 bg-secondary/80 border-b border-accent-content">
        <h2 className="text-lg font-semibold text-primary">
          {tReservations("filters.title")}
        </h2>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.completed === "true"}
              onChange={handleToggleCompleted}
              className="checkbox checkbox-sm checkbox-accent"
            />
            <span>{tReservations("filters.completed")}</span>
          </label>

          <label className="flex items-center gap-2 text-sm text-primary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.amountDue === "nonzero"}
              onChange={handleToggleAmountDue}
              className="checkbox checkbox-sm checkbox-accent"
            />
            <span>{tReservations("filters.amountDue")}</span>
          </label>
        </div>
      </div>

      {/* ✅ Reservations table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-accent-content">
          <thead className="bg-secondary/60 font-semibold text-primary uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left text-xs">
                {tReservations("list.name")}
              </th>
              <th className="px-6 py-3 text-left text-xs">
                {tReservations("list.items")}
              </th>
              <th className="px-6 py-3 text-left text-xs">
                {tReservations("list.total")}
              </th>
              <th className="px-6 py-3 text-left text-xs">
                {tReservations("list.amountDue")}
              </th>
              <th className="px-6 py-3 text-left text-xs">
                {tReservations("list.dateOfDelivery")}
              </th>
              <th className="px-6 py-3 text-left text-xs">
                {tReservations("list.status")}
              </th>
              <th className="px-6 py-3 text-right text-xs">
                {tReservations("list.actions")}
              </th>
            </tr>
          </thead>

          <tbody className="bg-accent/70 divide-y divide-accent-content">
            {filteredReservations.map((res) => {
              const isExpanded = expandedRows.includes(res._id);
              const firstProduct = res.products?.[0];
              const remainingCount = (res.products?.length || 0) - 1;

              return (
                <>
                  <tr
                    key={res._id}
                    className="hover:bg-accent/90 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-secondary align-middle">
                      {res.client?.name}
                      {isExpanded && res.client?.phone && (
                        <div className="text-xs flex gap-2 items-center text-secondary/60 mt-1">
                          <FaPhoneAlt /> {res.client?.phone}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-secondary/70 align-middle">
                      {firstProduct && (
                        <>
                          {tProducts(
                            `${
                              firstProduct.product?.key ||
                              firstProduct.product?.name
                            }.title`,
                            { defaultValue: firstProduct.product?.name || "—" }
                          )}{" "}
                          ({firstProduct.quantityInGrams} g) — €
                          {firstProduct.priceAtReservation?.toFixed(2) ||
                            "0.00"}
                        </>
                      )}
                      {remainingCount > 0 && !isExpanded && (
                        <span className="text-secondary/50 text-xs ml-2">
                          +{remainingCount} more
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-secondary/60 align-middle">
                      €{res.calculatedTotalAmmount?.toFixed(2) || "0.00"}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium align-middle">
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

                    <td className="px-6 py-4 text-sm text-secondary/60 align-middle">
                      {new Date(res.dateOfDelivery).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-sm align-middle">
                      {res.completed ? (
                        <span className="text-green-400 font-semibold">
                          {tCommon("status.completed")}
                        </span>
                      ) : (
                        <span className="text-yellow-400 font-semibold">
                          {tCommon("status.pending")}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-medium align-middle">
                      <div className="flex justify-end items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onEdit && onEdit(res)}
                          className="text-accent-content/60 hover:text-accent-content transition-colors"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteReservation(res._id)}
                          className="text-accent-content/60 hover:text-accent-content transition-colors"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleExpand(res._id)}
                          className="text-accent-content/60 hover:text-accent-content transition-colors"
                        >
                          {isExpanded ? (
                            <FaChevronUp className="h-4 w-4" />
                          ) : (
                            <FaChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.tr
                        key={`${res._id}-details`}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.25 }}
                        className="bg-primary/40"
                      >
                        <td
                          colSpan={7}
                          className="px-8 py-6 text-sm text-secondary/80"
                        >
                          <p className="text-center text-secondary font-semibold text-base mb-4 border-b border-accent/40 pb-2">
                            {tReservations("details.title", {
                              defaultValue: "Reservation Details",
                            })}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-secondary font-semibold mb-2 text-sm uppercase tracking-wide">
                                {tReservations("details.items", {
                                  defaultValue: "Products",
                                })}
                              </h4>
                              <div className="space-y-1 bg-primary p-3 rounded-lg border border-accent/30">
                                {res.products?.map((p, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between text-secondary/70 text-sm"
                                  >
                                    <span>
                                      {tProducts(
                                        `${
                                          p.product?.key || p.product?.name
                                        }.title`,
                                        { defaultValue: p.product?.name || "—" }
                                      )}{" "}
                                      ({p.quantityInGrams} g)
                                    </span>
                                    <span className="text-secondary/50">
                                      €
                                      {p.priceAtReservation?.toFixed(2) ||
                                        "0.00"}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-secondary font-semibold mb-2 text-sm uppercase tracking-wide">
                                {tReservations("details.notes", {
                                  defaultValue: "Notes",
                                })}
                              </h4>
                              <div className="bg-primary p-3 rounded-lg border border-accent/30 min-h-[100px]">
                                {res.notes ? (
                                  <p className="text-secondary/70 leading-relaxed whitespace-pre-wrap">
                                    {res.notes}
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
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default IRLReservationsList;
