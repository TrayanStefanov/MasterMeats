import { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaChevronDown, FaEye, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import { useClientStore } from "../stores/useClientStore";
import ReservationDetailsModal from "./ReservationDetailsModal";
import Pagination from "./Pagination";

const ClientsList = ({ onEdit }) => {
  const {
    clients,
    fetchClients,
    deleteClient,
    loading,
    totalCount,
    totalPages,
    currentPage,
    filters,
    setFilter,
  } = useClientStore();

  // Translations
  const { t: tUAC } = useTranslation("admin/usersAndClients");
  const { t: tCommon } = useTranslation("admin/common");
  const { t: tProducts } = useTranslation("productsSection");
  const { t: tReservations } = useTranslation("admin/reservations");

  const [expandedClient, setExpandedClient] = useState(null);
  const [modalReservation, setModalReservation] = useState(null);
  const [tagInput, setTagInput] = useState("");

  // Fetch clients whenever filters or page changes
  useEffect(() => {
    fetchClients(currentPage);
  }, [filters, currentPage]);

  // Refresh when language changes
  useEffect(() => {
    const handleLangChange = () => fetchClients(currentPage);
    i18next.on("languageChanged", handleLangChange);
    return () => i18next.off("languageChanged", handleLangChange);
  }, [fetchClients, currentPage]);

  // Add tag to filter
  const handleAddTag = (e) => {
    e.preventDefault();
    const newTag = tagInput.trim();
    if (!newTag) return;
    const currentTags = filters.tags || [];
    if (!currentTags.includes(newTag)) {
      setFilter("tags", [...currentTags, newTag]);
    }
    setTagInput("");
  };

  // Remove tag from filter
  const handleRemoveTag = (tagToRemove) => {
    setFilter(
      "tags",
      filters.tags.filter((t) => t !== tagToRemove)
    );
  };

  // Reset tag filters
  const clearAllTags = () => setFilter("tags", []);

  if (loading && clients.length === 0)
    return (
      <p className="text-center py-8 text-secondary/60">
        {tCommon("loading.loading")}
      </p>
    );

  if (!clients || clients.length === 0)
    return (
      <p className="text-center py-8 text-secondary/60">{tUAC("empty")}</p>
    );

  return (
    <>
      <div className="max-w-6xl mx-auto mt-6 bg-primary/60 rounded-lg border border-accent/30 p-4">
        <p className="text-secondary/70 text-sm font-semibold mb-2 uppercase">
          {tUAC("filters.tags", { defaultValue: "Filter by Tags" })}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {filters.tags?.length > 0 ? (
            filters.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-accent-content/20 text-primary px-2 py-1 rounded-full text-xs flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-accent-content/70 hover:text-accent-content text-xs"
                >
                  <FaTimes />
                </button>
              </span>
            ))
          ) : (
            <span className="text-secondary/40 text-sm italic">
              {tUAC("filters.noTags", { defaultValue: "No tag filters active" })}
            </span>
          )}

          <form onSubmit={handleAddTag} className="flex items-center gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder={tUAC("filters.addTagPlaceholder", {
                defaultValue: "Add tag and press Enter...",
              })}
              className="bg-secondary text-primary border border-accent/30 rounded-md px-3 py-1 text-sm outline-none placeholder:text-secondary/50"
            />
          </form>

          {filters.tags?.length > 0 && (
            <button
              onClick={clearAllTags}
              className="text-xs text-accent-content/60 hover:text-accent-content ml-2"
            >
              {tCommon("clear", { defaultValue: "Clear" })}
            </button>
          )}
        </div>
      </div>

      <motion.div
        className="bg-gray-800 shadow-xl rounded-lg overflow-hidden max-w-6xl mx-auto mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <table className="min-w-full divide-y divide-accent-content">
          <thead className="bg-secondary/80 font-semibold text-primary uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left text-xs">
                {tUAC("list.name")}
              </th>
              <th className="px-6 py-3 text-left text-xs">
                {tUAC("list.phone")}
              </th>
              <th className="px-6 py-3 text-left text-xs">
                {tUAC("list.items")}
              </th>
              <th className="px-6 py-3 text-left text-xs">
                {tUAC("list.total")}
              </th>
              <th className="px-6 py-3 text-left text-xs">
                {tUAC("list.status")}
              </th>
              <th className="px-6 py-3 text-right text-xs">
                {tUAC("list.actions")}
              </th>
            </tr>
          </thead>

          <tbody className="bg-accent/70 divide-y divide-accent-content">
            {clients.map((client) => (
              <Fragment key={client._id}>
                <tr
                  className="hover:bg-accent/90 transition-colors cursor-pointer"
                  onClick={() =>
                    setExpandedClient(
                      expandedClient === client._id ? null : client._id
                    )
                  }
                >
                  {/* Client Name + Tags */}
                  <td className="px-6 py-4 whitespace-nowrap text-secondary">
                    <div>
                      <p className="font-medium">{client.name}</p>
                      {client.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {client.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-accent-content/10 text-xs text-accent-content px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4 text-secondary/70">
                    {client.phone || "—"}
                  </td>

                  {/* Last Reserved Items */}
                  <td className="px-6 py-4 text-secondary/70">
                    {client.lastOrder?.products?.length ? (
                      <div className="space-y-1">
                        {client.lastOrder.products.map((p, idx) => (
                          <p key={idx} className="text-xs text-secondary/60">
                            {tProducts(
                              `${p.product?.key || p.product?.name}.title`,
                              {
                                defaultValue: p.product?.name || "—",
                              }
                            )}{" "}
                            ({p.quantityInGrams} g)
                          </p>
                        ))}
                      </div>
                    ) : (
                      <span className="text-secondary/40 italic">
                        {tReservations("details.noItems", {
                          defaultValue: "No items",
                        })}
                      </span>
                    )}
                  </td>

                  {/* Total # of Reservations */}
                  <td className="px-6 py-4 text-secondary/70">
                    {client.totalReservations ?? "—"}
                  </td>

                  {/* Last Reservation Status */}
                  <td className="px-6 py-4 text-secondary/70">
                    {client.lastOrder ? (
                      client.lastOrder.completed ? (
                        <span className="text-green-400">
                          {tReservations("details.completed", {
                            defaultValue: "Completed",
                          })}
                        </span>
                      ) : (
                        <span className="text-yellow-400">
                          {tReservations("details.pending", {
                            defaultValue: "Pending",
                          })}
                        </span>
                      )
                    ) : (
                      <span className="text-secondary/40 italic">
                        {tReservations("details.noOrders", {
                          defaultValue: "No reservations",
                        })}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(client);
                        }}
                        className="text-accent-content/60 hover:text-accent-content transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteClient(client._id);
                        }}
                        className="text-accent-content/60 hover:text-accent-content transition-colors"
                      >
                        <FaTrash />
                      </button>
                      <FaChevronDown
                        className={`transition-transform ${expandedClient === client._id ? "rotate-180" : ""
                          }`}
                      />
                    </div>
                  </td>
                </tr>

                <AnimatePresence>
                  {expandedClient === client._id && client.reservations && (
                    <motion.tr
                      key={`${client._id}-details`}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.25 }}
                      className="bg-primary/40"
                    >
                      <td
                        colSpan={6}
                        className="px-8 py-6 text-sm text-secondary/80"
                      >
                        <p className="text-center text-secondary font-semibold text-base mb-4 border-b border-accent/40 pb-2">
                          {tReservations("details.title", {
                            defaultValue: "Order History",
                          })}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-secondary font-semibold mb-2 text-sm uppercase tracking-wide">
                              {tReservations("details.items", {
                                defaultValue: "Orders",
                              })}
                            </h4>
                            <div className="space-y-2 bg-primary p-3 rounded-lg border border-accent/30">
                              {client.reservations.map((r) => (
                                <div
                                  key={r._id}
                                  className="flex justify-between items-center bg-gray-800/40 p-3 rounded-lg"
                                >
                                  <div>
                                    <p className="text-secondary/70">
                                      {new Date(
                                        r.dateOfDelivery
                                      ).toLocaleDateString()}{" "}
                                      —{" "}
                                      {r.completed ? (
                                        <span className="text-green-400">
                                          {tReservations("details.completed", {
                                            defaultValue: "Completed",
                                          })}
                                        </span>
                                      ) : (
                                        <span className="text-yellow-400">
                                          {tReservations("details.pending", {
                                            defaultValue: "Pending",
                                          })}
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-xs text-secondary/50">
                                      Total: €
                                      {r.calculatedTotalAmmount?.toFixed(2) ??
                                        "—"}
                                    </p>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setModalReservation(r);
                                    }}
                                    className="text-accent-content/70 hover:text-accent-content"
                                  >
                                    <FaEye />
                                  </button>
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
                              {client.notes ? (
                                <p className="text-secondary/70 leading-relaxed whitespace-pre-wrap">
                                  {client.notes}
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
              </Fragment>
            ))}
          </tbody>
        </table>

        {/* Pagination footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          showingCount={clients.length}
          onPageChange={(page) => fetchClients(page)}
        />
      </motion.div>

      {modalReservation && (
        <ReservationDetailsModal
          reservation={modalReservation}
          onClose={() => setModalReservation(null)}
        />
      )}
    </>
  );
};

export default ClientsList;
