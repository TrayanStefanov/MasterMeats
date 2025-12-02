import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrash,
  FaEdit,
  FaPhoneAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { MdDone, MdDoneOutline  } from "react-icons/md";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import { useReservationStore } from "../stores/useReservationStore";
import Pagination from "./Pagination";
import ReservationFilters from "./ReservationFilters";

const IRLReservationsList = ({ onEdit }) => {
  const {
    reservations,
    fetchFilteredReservations,
    deleteReservation,
    completeReservation,
    loading,
    currentPage,
    totalPages,
    totalCount,
  } = useReservationStore();

  const { t: tCommon } = useTranslation("admin/common");
  const { t: tReservations } = useTranslation("admin/reservations");
  const { t: tProducts } = useTranslation("productsSection");

  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    // Fetch on mount
    fetchFilteredReservations();

    const handleLangChange = () => fetchFilteredReservations();
    i18next.on("languageChanged", handleLangChange);
    return () => i18next.off("languageChanged", handleLangChange);
  }, [fetchFilteredReservations]);

  const toggleExpand = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/80 text-white";
      case "deliveredNotPaid":
        return "bg-red-500/80 text-white";
      case "paidNotDelivered":
        return "bg-yellow-500/80 text-white";
      case "reserved":
        return "bg-blue-500/80 text-white";
      default:
        return "bg-gray-500/60 text-white";
    }
  };

  if (loading && reservations.length === 0) {
    return (
      <p className="text-center py-8 text-secondary/60">
        {tCommon("loading.loading")}
      </p>
    );
  }

  if (!reservations || reservations.length === 0) {
    return (
      <div className="max-w-6xl mx-auto mt-8">
        <ReservationFilters />
        <p className="text-center py-8 text-secondary/60">
          {tReservations("empty")}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col shadow-xl rounded-md overflow-hidden max-w-6xl mx-auto gap-8 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Filters */}
      <ReservationFilters />

      {/* Reservations Table */}
      <div className="overflow-x-auto mt-4 hidden md:block">
        <table className="min-w-full divide-y divide-accent-content">
          <thead className="bg-secondary/60 font-semibold text-primary uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left text-xs">
                {tReservations("list.name")}
              </th>
              <th className="px-6 py-3 text-left text-xs hidden lg:table-cell">
                {tReservations("list.items")}
              </th>
              <th className="px-6 py-3 text-left text-xs">
                {tReservations("list.total")}
              </th>
              <th className="px-6 py-3 text-left text-xs hidden lg:table-cell">
                {tReservations("list.amountDue")}
              </th>
              <th className="px-6 py-3 text-left text-xs">
                {tReservations("list.dateOfDelivery")}
              </th>
              <th className="px-6 py-3 text-center text-xs">
                {tReservations("list.status")}
              </th>
              <th className="px-6 py-3 text-right text-xs">
                {tReservations("list.actions")}
              </th>
            </tr>
          </thead>

          <tbody className="bg-accent/70 divide-y divide-accent-content">
            {reservations.map((res) => {
              const isExpanded = expandedRows.includes(res._id);
              const firstProduct = res.products?.[0];
              const remainingCount = (res.products?.length || 0) - 1;

              return (
                <React.Fragment key={res._id}>
                  <tr className="hover:bg-accent/90 transition-colors">
                    <td className="px-6 py-4 text-sm text-secondary align-middle">
                      {res.client?.name}
                      {isExpanded && res.client?.phone && (
                        <div className="text-xs flex gap-2 items-center text-secondary/60 mt-1">
                          <FaPhoneAlt /> {res.client?.phone}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-secondary/70 align-middle hidden lg:table-cell">
                      {firstProduct && (
                        <>
                          {tProducts(
                            `${
                              firstProduct.product?.key ||
                              firstProduct.product?.name
                            }.title`,
                            {
                              defaultValue: firstProduct.product?.name || "—",
                            }
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
                      €{res.calculatedTotalAmount?.toFixed(2) || "0.00"}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium align-middle hidden lg:table-cell">
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

                    <td className="px-6 py-4 text-sm align-middle text-center text-nowrap">
                      <span
                        className={`px-3 py-1 rounded-lg font-medium ${getStatusBadgeColor(
                          res.status
                        )}`}
                      >
                        {tCommon(`status.${res.status}`)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-medium align-middle">
                      <div className="flex justify-end items-center gap-3">
                        <button
                          type="button"
                          onClick={() => completeReservation(res._id)}
                          disabled={res.completed}
                          title={res.completed ? tCommon("status.completed") : tCommon("buttons.markAsCompleted")}
                          className={`transition-colors text-xl ${
                            res.completed
                              ? "text-primary cursor-default"
                              : "text-accent-content/60 hover:text-accent-content"
                          }`}
                        >
                          {res.completed ? (
                            <MdDone className="h-8 w-8"/>
                          ) : (
                            <MdDoneOutline className="h-6 w-6"/>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit && onEdit(res)}
                          title={tCommon("buttons.updateReservation")}
                          className="text-accent-content/60 hover:text-accent-content transition-colors"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteReservation(res._id)}
                          title={tCommon("buttons.deleteReservation")}
                          className="text-accent-content/60 hover:text-accent-content transition-colors"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleExpand(res._id)}
                          title={isExpanded ? tCommon("buttons.hideDetails") : tCommon("buttons.showDetails")}
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
                          {/* Details section */}
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
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile cards using same collapsed style as ClientsList */}
      <div className="md:hidden space-y-4 p-2 bg-secondary/80">
        {reservations.map((res) => {
          const isExpanded = expandedRows.includes(res._id);
          return (
            <motion.div key={res._id} className="bg-accent rounded-lg overflow-hidden" layout>
              {/* Card Header */}
              <div className="flex items-center justify-between p-3 cursor-pointer">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-secondary">{res.client?.name}</p>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium w-fit ${getStatusBadgeColor(res.status)}`}>
                    {tCommon(`status.${res.status}`)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-secondary/70 font-medium">€{res.calculatedTotalAmount?.toFixed(2) || "0.00"}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      completeReservation(res._id);
                    }}
                    disabled={res.completed}
                    className={`transition-colors ${
                      res.completed
                        ? "text-primary cursor-default"
                        : "text-accent-content/60 hover:text-accent-content"
                    }`}
                  >
                    {res.completed ? <MdDone className="h-6 w-6" /> : <MdDoneOutline className="h-6 w-6" />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit && onEdit(res);
                    }}
                    className="text-accent-content/60 hover:text-accent-content"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteReservation(res._id);
                    }}
                    className="text-accent-content/60 hover:text-accent-content"
                  >
                    <FaTrash />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(res._id);
                    }}
                    className="text-accent-content/60 hover:text-accent-content"
                  >
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>

              {/* Expanded section */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    key={`${res._id}-details`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="bg-primary/40 px-4 py-2 text-secondary/80 text-sm space-y-2"
                  >
                    <p>Phone: {res.client?.phone || "—"}</p>
                    <p>Amount Due: €{res.amountDue?.toFixed(2) || "0.00"}</p>
                    <p>Delivery: {new Date(res.dateOfDelivery).toLocaleDateString()}</p>

                    {res.products?.length > 0 && (
                      <div>
                        <p className="font-semibold text-secondary mb-1">Products:</p>
                        {res.products.map((p, idx) => (
                          <div key={idx} className="flex justify-between text-secondary/70 text-sm">
                            <span>{tProducts(`${p.product?.key || p.product?.name}.title`, { defaultValue: p.product?.name || "—" })} ({p.quantityInGrams} g)</span>
                            <span className="text-secondary/50">€{p.priceAtReservation?.toFixed(2) || "0.00"}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-secondary mb-1">Notes:</p>
                      {res.notes ? (
                        <p className="text-secondary/70 whitespace-pre-wrap">{res.notes}</p>
                      ) : (
                        <p className="text-secondary/40 italic">No notes provided.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        showingCount={reservations.length}
        onPageChange={(page) => fetchFilteredReservations(page)}
      />
    </motion.div>
  );
};

export default IRLReservationsList;
