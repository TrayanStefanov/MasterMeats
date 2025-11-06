import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle, FaArrowLeft, FaSpinner, FaSave } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useClientStore } from "../stores/useClientStore";
import ClientsList from "../components/ClientsList";
import ClientForm from "../components/ClientForm";

const ClientsTab = () => {
  const { fetchClients, createClient, updateClient, loading } = useClientStore();
  const [mode, setMode] = useState("list"); // "list" | "create" | "edit"
  const [client, setClient] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
    tags: [],
  });

  const { t: tUAC } = useTranslation("admin/usersAndClients");
  const { t: tCommon } = useTranslation("admin/common");

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleEdit = (clientData) => {
    setClient(clientData);
    setMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreate = () => {
    setClient({ name: "", phone: "", email: "", notes: "", tags: [] });
    setMode("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = async () => {
    setMode("list");
    setClient({ name: "", phone: "", email: "", notes: "", tags: [] });
    await fetchClients();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!client.name || !client.phone) return;

    if (mode === "edit" && client._id) {
      await updateClient(client._id, client);
    } else {
      await createClient(client);
    }

    handleBack();
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
            className="flex flex-col gap-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-accent-content">
                {tUAC("tabs.clients")}
              </h2>
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 bg-accent text-accent-content px-4 py-2 rounded-xl hover:bg-accent/80 transition"
              >
                <FaPlusCircle /> {tCommon("buttons.createClient")}
              </button>
            </div>

            <ClientsList onEdit={handleEdit} />
          </motion.div>
        )}

        {(mode === "create" || mode === "edit") && (
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={handleBack}
              className="mb-4 flex justify-center items-center gap-2 py-3 px-4 bg-accent text-accent-content font-medium rounded-xl shadow-md hover:bg-accent/80 transition disabled:opacity-50"
            >
              <FaArrowLeft /> {tUAC("back")}
            </button>

            <form
              onSubmit={handleSubmit}
              className={`space-y-6 ${
                loading ? "opacity-75 pointer-events-none" : ""
              }`}
            >
              <ClientForm client={client} setClient={setClient} />

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-accent text-accent-content font-medium rounded-xl shadow-md hover:bg-accent/80 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    {mode === "edit"
                      ? tCommon("buttons.updating")
                      : tCommon("buttons.creating")}
                  </>
                ) : (
                  <>
                    {mode === "edit" ? <FaSave /> : <FaPlusCircle />}
                    {mode === "edit"
                      ? tCommon("buttons.updateClient")
                      : tCommon("buttons.createClient")}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ClientsTab;
