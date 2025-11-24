import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle, FaArrowLeft, FaSpinner, FaSave } from "react-icons/fa";
import { useBatchStore } from "../stores/useBatchStore";
import { useTranslation } from "react-i18next";


// Placeholder components (to be created later)
const BatchList = ({ onEdit }) => (
  <div className="text-lg opacity-70">Batch list goes here...</div>
);

const BatchForm = ({ batch, mode, onChange }) => (
  <div className="text-lg opacity-70">
    Batch creation/phase stepper will be implemented here...
  </div>
);

const BatchesTab = () => {
  const {
    fetchBatches,
    createBatch,
    updatePhase,
    loading,
    currentBatch,
    clearCurrentBatch,
  } = useBatchStore();

  const [mode, setMode] = useState("list");
  const [batch, setBatch] = useState({}); 

  const { t: tProduction } = useTranslation("admin/production");
  const { t: tCommon } = useTranslation("admin/common");

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleCreate = () => {
    setBatch({});
    setMode("create");
    clearCurrentBatch();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (batchData) => {
    setBatch(batchData);
    setMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = async () => {
    setMode("list");
    clearCurrentBatch();
    await fetchBatches();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "create") {
        await createBatch(batch);
      } else {
        // Edit mode — update only allowed phases
        // Will be replaced with phase-specific update calls
      }
      handleBack();
    } catch (err) {
      console.error(err);
    }
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

            <form
              onSubmit={handleSubmit}
              className={`space-y-6 ${
                loading ? "opacity-75 pointer-events-none" : ""
              }`}
            >
              <BatchForm batch={batch} mode={mode} onChange={setBatch} />

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
                      ? tCommon("buttons.update")
                      : tCommon("buttons.create")}
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

export default BatchesTab;
