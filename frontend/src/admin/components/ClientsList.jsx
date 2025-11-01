import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useClientStore } from "../stores/useClientStore";

const ClientsList = ({ onEdit }) => {
  const { clients, fetchClients, deleteClient, loading, totalCount } = useClientStore();
  const { t: tUAC } = useTranslation("admin/usersAndClients");
  const { t: tCommon } = useTranslation("admin/common");

  // Fetch clients on mount and when language changes
  useEffect(() => {
    fetchClients();

    const handleLangChange = () => fetchClients();
    i18next.on("languageChanged", handleLangChange);
    return () => i18next.off("languageChanged", handleLangChange);
  }, [fetchClients]);

  if (loading && clients.length === 0) {
    return (
      <p className="text-center py-8 text-secondary/60">
        {tCommon("loading.loading")}
      </p>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <p className="text-center py-8 text-secondary/60">
        {tUAC("empty")}
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
            <tr
              key={client._id}
              className="hover:bg-accent/90 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-secondary">
                {client.name}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-secondary/70">
                {client.phone}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-secondary/70">
                {client.itemsCount ?? "—"}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-secondary/70">
                €{client.totalAmount?.toFixed(2) ?? "—"}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    client.completed
                      ? "bg-green-600/40 text-green-300"
                      : "bg-yellow-600/40 text-yellow-200"
                  }`}
                >
                  {client.completed
                    ? tCommon("status.completed")
                    : tCommon("status.pending")}
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-middle">
                <div className="flex justify-end items-center gap-3 h-full">
                  <button
                    onClick={() => onEdit(client)}
                    className="text-accent-content/60 hover:text-accent-content transition-colors"
                    title={tCommon("buttons.updateClient")}
                  >
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteClient(client._id)}
                    className="text-accent-content/60 hover:text-accent-content transition-colors"
                    title={tCommon("buttons.deleteClient")}
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-4 text-sm text-secondary/70 text-right">
        {tCommon("pagination.showing")} {clients.length} / {totalCount}{" "}
        {tUAC("title").toLowerCase()}
      </div>
    </motion.div>
  );
};

export default ClientsList;
