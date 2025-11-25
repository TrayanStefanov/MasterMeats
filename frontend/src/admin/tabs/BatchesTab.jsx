import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle, FaArrowLeft } from "react-icons/fa";
import { useBatchStore } from "../stores/useBatchStore";
import { useTranslation } from "react-i18next";

import BatchCreate from "../components/BatchesCreate";

const BatchList = ({ onEdit }) => (
  <div className="text-lg opacity-70">Batch list goes here…</div>
);

const BatchesTab = () => {
  const { fetchBatches, clearCurrentBatch } = useBatchStore();

  const [mode, setMode] = useState("list"); // list | create | edit
  const [selectedBatch, setSelectedBatch] = useState(null);

  const { t: tProduction } = useTranslation("admin/production");
  const { t: tCommon } = useTranslation("admin/common");

  useEffect(() => {
    fetchBatches();
  }, []);

  /** Start creating a batch */
  const handleCreate = () => {
    clearCurrentBatch();
    setSelectedBatch(null);
    setMode("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Edit an existing batch */
  const handleEdit = (batch) => {
    setSelectedBatch(batch);
    setMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Back to list */
  const handleBack = async () => {
    setMode("list");
    clearCurrentBatch();
    await fetchBatches();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <AnimatePresence mode="wait">
        {/* ---------------- LIST VIEW ---------------- */}
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
              <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-accent-content">
                {tProduction("tabs.batches") || "Batches"}
              </h2>

              <button
                onClick={handleCreate}
                className="flex items-center text-base lg:text-xl xl:text-2xl gap-2 bg-accent text-accent-content px-4 py-2 rounded-xl hover:bg-accent/80 transition"
              >
                <FaPlusCircle /> {tCommon("buttons.create") || "Create Batch"}
              </button>
            </div>

            <BatchList onEdit={handleEdit} />
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
              <FaArrowLeft /> {tCommon("buttons.back") || "Back"}
            </button>

            <BatchCreate
              editBatch={selectedBatch}
              onFinish={handleBack} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BatchesTab;
