import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle, FaArrowLeft, FaSpinner, FaSave } from "react-icons/fa";
import { useSpiceMixStore } from "../stores/useSpiceMixStore";
import SpiceMixList from "../components/SpiceMixList";
import SpiceMixForm from "../components/SpiceMixForm";

const SpiceMixesTab = () => {
  const { fetchSpiceMixes, createSpiceMix, updateSpiceMix, loading, filters } =
    useSpiceMixStore();

  useEffect(() => {
    fetchSpiceMixes();
  }, [fetchSpiceMixes, filters]); // <- refetch whenever filters change

  const [mode, setMode] = useState("list"); // list | create | edit
  const [mix, setMix] = useState({
    name: "",
    notes: "",
    tags: [],
    stockInKg: 0,
    ingredients: [],
    isActive: true,
  });

  const handleEdit = (mixData) => {
    setMix(mixData);
    setMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreate = () => {
    setMix({
      name: "",
      notes: "",
      tags: [],
      stockInKg: 0,
      ingredients: [],
      isActive: true,
    });
    setMode("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = async () => {
    setMode("list");
    setMix({
      name: "",
      notes: "",
      tags: [],
      stockInKg: 0,
      ingredients: [],
      isActive: true,
    });
    await fetchSpiceMixes();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mix.name) return;

    try {
      if (mode === "edit" && mix._id) {
        await updateSpiceMix(mix._id, mix);
      } else {
        await createSpiceMix(mix);
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
                Spice Mixes
              </h2>
              <button
                onClick={handleCreate}
                className="flex items-center text-base lg:text-xl xl:text-2xl gap-2 bg-accent text-accent-content px-4 py-2 rounded-xl hover:bg-accent/80 transition"
              >
                <FaPlusCircle /> Create Mix
              </button>
            </div>
            <SpiceMixList onEdit={handleEdit} />
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
              <FaArrowLeft /> Back
            </button>

            <form
              onSubmit={handleSubmit}
              className={`space-y-6 ${
                loading ? "opacity-75 pointer-events-none" : ""
              }`}
            >
              <SpiceMixForm
                mix={mix}
                mode={mode}
                onChange={(updated) => setMix(updated)}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-accent text-accent-content font-medium rounded-xl shadow-md hover:bg-accent/80 transition disabled:opacity-50"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {mode === "edit" ? "Update Mix" : "Create Mix"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SpiceMixesTab;
