import { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaChevronDown, FaChevronUp, FaEye } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useClientStore } from "../stores/useClientStore";
import ReservationDetailsModal from "./ReservationDetailsModal";
import Pagination from "./Pagination";
import ClientFilters from "./ClientFilters";

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
  } = useClientStore();

  const { t: tUAC } = useTranslation("admin/usersAndClients");
  const { t: tCommon } = useTranslation("admin/common");
  const { t: tReservations } = useTranslation("admin/reservations");
  const { t: tForms } = useTranslation("admin/forms");

  const [expandedClient, setExpandedClient] = useState(null);
  const [modalReservation, setModalReservation] = useState(null);

  useEffect(() => {
    fetchClients(currentPage);
  }, [filters, currentPage]);

  useEffect(() => {
    const handleLangChange = () => fetchClients(currentPage);
    i18next.on("languageChanged", handleLangChange);
    return () => i18next.off("languageChanged", handleLangChange);
  }, [fetchClients, currentPage]);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/80 text-white";
      case "reserved":
        return "bg-blue-500/80 text-white";
      case "inProcess":
        return "bg-yellow-500/80 text-white";
      case "none":
        return "bg-gray-500/60 text-white";
      default:
        return "bg-gray-500/60 text-white";
    }
  };

  if (loading && clients.length === 0)
    return (
      <p className="text-center py-8 text-secondary/60">
        {tCommon("loading.loading")}
      </p>
    );

  if (!clients || clients.length === 0)
    return (
      <>
        <ClientFilters />
        <p className="text-center py-8 text-secondary/60">{tUAC("empty")}</p>
      </>
    );

  return (
    <>
      <ClientFilters />

      <motion.div
        className="bg-gray-800 shadow-xl rounded-lg overflow-hidden max-w-6xl mx-auto mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <table className="min-w-full divide-y divide-accent-content hidden md:table">
          <thead className="bg-secondary/80 font-semibold text-primary uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left text-xs">
                {tUAC("list.name")}
              </th>
              <th className="px-6 py-3 text-left text-xs">{tUAC("list.phone")}</th>
              <th className="px-6 py-3 text-left text-xs">{tUAC("list.total")}</th>
              <th className="px-6 py-3 text-left text-xs">{tUAC("list.status")}</th>
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
                  <td className="px-6 py-4 text-secondary align-top">
                    <div className="flex flex-col">
                      <p className="font-semibold text-base">{client.name}</p>

                      {client.tags?.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {client.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-primary/60 text-primary-content text-xs font-medium px-2 py-0.5 rounded-full border border-accent/30"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-secondary/40 italic text-xs mt-1">
                          {tForms("client.noTags")}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-secondary/70">
                    {client.phone || "—"}
                  </td>
                  <td className="px-6 py-4 text-secondary/70">
                    €{client.totalPaid?.toFixed(2) ?? "—"}
                  </td>

                  {/* ✅ Order Status (from backend) */}
                  <td className="px-6 py-4 text-secondary/70">
                    {client.orderStatus ? (
                      <span
                        className={`px-3 py-1 text-xs rounded-lg font-medium ${getStatusBadgeColor(
                          client.orderStatus
                        )}`}
                      >
                        {tCommon(`status.${client.orderStatus}`, {
                          defaultValue: client.orderStatus,
                        })}
                      </span>
                    ) : (
                      <span className="text-secondary/40">—</span>
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
                        title={tCommon("buttons.updateClient")}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteClient(client._id);
                        }}
                        className="text-accent-content/60 hover:text-accent-content transition-colors"
                        title={tCommon("buttons.deleteClient")}
                      >
                        <FaTrash />
                      </button>
                      <FaChevronDown
                        className={`transition-transform ${
                          expandedClient === client._id ? "rotate-180" : ""
                        }`}
                        title={expandedClient === client._id ? tCommon("buttons.hideDetails") : tCommon("buttons.showDetails")}
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
                        colSpan={7}
                        className="px-8 py-6 text-sm text-secondary/80"
                      >
                        <p className="text-center text-secondary font-semibold text-base mb-4 border-b border-accent/40 pb-2">
                          {tUAC("details.title", {
                            defaultValue: "Order History",
                          })}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-secondary font-semibold mb-2 text-sm uppercase tracking-wide">
                              {tUAC("details.items", {
                                defaultValue: "Orders",
                              })}
                            </h4>
                            <div className="space-y-2 bg-primary p-3 rounded-lg border border-accent/30">
                              {[...client.reservations].map((r) => (
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
                                      <span
                                        className={`font-semibold rounded-md px-2 py-1 ${
                                          r.status === "completed"
                                            ? "bg-green-500/80 text-white"
                                            : r.status === "reserved"
                                            ? "bg-blue-500/80 text-white"
                                            : r.status === "deliveredNotPaid"
                                            ? "bg-red-500/80 text-white"
                                            : r.status === "paidNotDelivered"
                                            ? "bg-yellow-500/80 text-white"
                                            : "text-secondary/50"
                                        }`}
                                      >
                                        {tCommon(`status.${r.status}`, {
                                          defaultValue: r.status,
                                        })}
                                      </span>
                                    </p>
                                    <p className="text-xs text-secondary/50 mt-2">
                                      {tReservations("details.totalAmount")}
                                      {r.calculatedTotalAmount?.toFixed(2) ??
                                        "—"}
                                    </p>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setModalReservation(r);
                                    }}
                                    className="text-accent-content/70 hover:text-accent-content"
                                    title={tCommon("buttons.showOrder")}
                                  >
                                    <FaEye />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-secondary font-semibold mb-2 text-sm uppercase tracking-wide">
                              {tUAC("details.notes", {
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
                                  {tUAC("details.noNotes", {
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
        <div className="md:hidden space-y-4 p-2 bg-secondary/80">
          {clients.map((client) => {
            const isExpanded = expandedClient === client._id;
            return (
              <motion.div
                key={client._id}
                className="bg-accent rounded-lg overflow-hidden"
                layout
              >
                {/* Card Header */}
                <div className="flex items-center justify-between p-3 cursor-pointer">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-secondary">
                      {client.name}
                    </p>
                    {client.orderStatus && (
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-medium w-fit ${getStatusBadgeColor(
                          client.orderStatus
                        )}`}
                      >
                        {tCommon(`status.${client.orderStatus}`, {
                          defaultValue: client.orderStatus,
                        })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(client);
                      }}
                      className="text-accent-content/60 hover:text-accent-content"
                      title={tCommon("buttons.updateClient")}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteClient(client._id);
                      }}
                      className="text-accent-content/60 hover:text-accent-content"
                      title={tCommon("buttons.deleteClient")}
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedClient(isExpanded ? null : client._id);
                      }}
                      className="text-accent-content/60 hover:text-accent-content"
                      title={isExpanded ? tCommon("buttons.hideDetails") : tCommon("buttons.showDetails")}
                    >
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>
                </div>

                {/* Expandable Info */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      key={`${client._id}-details`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="bg-primary/40 px-4 py-2 text-secondary/80 text-sm space-y-2"
                    >
                      <p>{tUAC("list.phone")} {client.phone || "—"}</p>
                      <p>{tUAC("list.total")}: €{client.totalPaid?.toFixed(2) ?? "—"}</p>

                      {client.reservations &&
                        client.reservations.length > 0 && (
                          <div className="space-y-2">
                            <p className="font-semibold text-secondary">
                              {tUAC("details.title")}
                            </p>
                            {client.reservations.map((r) => (
                              <div
                                key={r._id}
                                className="flex justify-between items-center bg-gray-800/40 p-2 rounded"
                              >
                                <div>
                                  <p className="text-secondary/70 text-xs">
                                    {new Date(
                                      r.dateOfDelivery
                                    ).toLocaleDateString()}{" "}
                                    —{" "}
                                    <span
                                      className={`font-semibold rounded px-1 ${
                                        r.status === "completed"
                                          ? "bg-green-500/80 text-white"
                                          : r.status === "reserved"
                                          ? "bg-blue-500/80 text-white"
                                          : r.status === "inProcess"
                                          ? "bg-yellow-500/80 text-white"
                                          : "bg-gray-500/60 text-white"
                                      }`}
                                    >
                                      {tCommon(`status.${r.status}`, {
                                        defaultValue: r.status,
                                      })}
                                    </span>
                                  </p>
                                  <p className="text-xs text-secondary/50 mt-1">
                                    {tReservations("details.totalAmount")}: €
                                    {r.calculatedTotalAmount?.toFixed(2) ?? "—"}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setModalReservation(r);
                                  }}
                                  className="text-accent-content/70 hover:text-accent-content"
                                  title={tCommon("buttons.showOrder")}
                                >
                                  <FaEye />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                      <div>
                        <p className="font-semibold text-secondary mb-1">
                          {tUAC("details.notes")} :
                        </p>
                        {client.notes ? (
                          <p className="text-secondary/70 whitespace-pre-wrap">
                            {client.notes}
                          </p>
                        ) : (
                          <p className="text-secondary/40 italic">
                            {tUAC("details.noNotes")}
                          </p>
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
          totalPages={totalPages}
          currentPage={currentPage}
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
