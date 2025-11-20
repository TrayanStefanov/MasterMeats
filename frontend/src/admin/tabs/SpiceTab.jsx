import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle, FaArrowLeft, FaSpinner, FaSave } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useSpiceStore } from "../stores/useSpiceStore";
import SpiceList from "../components/SpiceList";
import SpiceForm from "../components/SpiceForm";

const SpiceTab = () => {
  const { fetchSpices, createSpice, updateSpice, loading } = useSpiceStore();
  const [mode, setMode] = useState("list"); // "list" | "create" | "edit"
  const [spice, setSpice] = useState({
    _id: null,
    name: "",
    costPerKg: "",
    supplier: "",
    notes: "",
    stockInGrams: 0,
    isActive: true,
  });

  const { t: tProduction } = useTranslation("admin/production");
  const { t: tCommon } = useTranslation("admin/common");

  // Fetch spices on mount
  useEffect(() => {
    fetchSpices();
  }, [fetchSpices]);

  const handleEdit = (spiceData) => {
    setSpice({ ...spiceData }); // preserves _id
    setMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreate = () => {
    setSpice({
      name: "",
      costPerKg: "",
      supplier: "",
      notes: "",
      stockInGrams: 0,
      isActive: true,
    });
    setMode("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = async () => {
    setMode("list");
    setSpice({
      name: "",
      costPerKg: "",
      supplier: "",
      notes: "",
      stockInGrams: 0,
      isActive: true,
    });
    await fetchSpices();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!spice.name) return;

    try {
      if (mode === "edit" && spice._id) {
        await updateSpice(spice._id, spice);
      } else {
        await createSpice(spice);
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
                {tProduction("tabs.spices")}
              </h2>
              <button
                onClick={handleCreate}
                className="flex items-center text-base lg:text-xl xl:text-2xl gap-2 bg-accent text-accent-content px-4 py-2 rounded-xl hover:bg-accent/80 transition"
              >
                <FaPlusCircle /> {tCommon("buttons.createSpice")}
              </button>
            </div>

            <SpiceList onEdit={handleEdit} />
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
              <FaArrowLeft /> {tProduction("spices.back")}
            </button>

            <form
              onSubmit={handleSubmit}
              className={`space-y-6 ${
                loading ? "opacity-75 pointer-events-none" : ""
              }`}
            >
              <SpiceForm spice={spice} mode={mode} onChange={setSpice} />

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
                      ? tCommon("buttons.updateSpice")
                      : tCommon("buttons.createSpice")}
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

export default SpiceTab;
