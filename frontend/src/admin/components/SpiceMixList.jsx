import { useState, useEffect, Fragment, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

import axios from "axios";
import toast from "react-hot-toast";
import { useProductionStore } from "../stores/useProductionStore";


const SpiceMixList = ({ onEdit }) => {
  const { spiceMixes = [], fetchSpiceMixes, deleteSpiceMix, updateSpiceMix, loading } =
    useProductionStore();

  const [expandedMix, setExpandedMix] = useState(null);
  const [showPercent, setShowPercent] = useState(false);
  const [stockInputs, setStockInputs] = useState({});

  const expandedRef = useRef(null);

  useEffect(() => {
    fetchSpiceMixes();
  }, [fetchSpiceMixes]);

  // Auto-scroll when expanded
  useEffect(() => {
    if (expandedRef.current) {
      expandedRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [expandedMix]);

  const handleToggleActive = async (mix) => {
    await updateSpiceMix(mix._id, { isActive: !mix.isActive });
  };

  const handleIncreaseStock = async (mixId) => {
  const increment = parseFloat(stockInputs[mixId]);
  if (isNaN(increment) || increment <= 0) return;

  try {
    // Call the specialized addStock API
    const res = await axios.put(`/api/spicemixes/${mixId}/addStock`, {
      increaseBy: increment,
    });

    // Update local state in Zustand
    updateSpiceMix(mixId, res.data);

    setStockInputs((prev) => ({ ...prev, [mixId]: "" }));
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to add stock");
  }
};


  const formulaPreview = (ingredients) => {
    if (!ingredients?.length) return "";
    const names = ingredients.slice(0, 2).map((i) => i.spice?.name);
    const remaining = ingredients.length - 2;
    return remaining > 0 ? `${names.join(", ")}, +${remaining} more...` : names.join(", ");
  };

  if (loading && spiceMixes.length === 0)
    return <p className="text-center py-8 text-secondary/60">Loading mixes...</p>;

  if (!spiceMixes.length)
    return <p className="text-center py-8 text-secondary/60">No spice mixes found.</p>;

  return (
    <motion.div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-accent-content">
        <thead className="bg-secondary/80 font-semibold text-primary uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Notes</th>
            <th className="px-6 py-3 text-left">Tags</th>
            <th className="px-6 py-3 text-left">Stock</th>
            <th className="px-6 py-3 text-left">Cost / 100g</th>
            <th className="px-6 py-3 text-left">Formula</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-accent/70 divide-y divide-accent-content">
          {spiceMixes.map((mix) => {
            const totalGrams = mix.ingredients.reduce((sum, i) => sum + i.grams, 0);

            return (
              <Fragment key={mix._id}>
                <tr
                  className="cursor-pointer hover:bg-accent/80 transition-colors"
                  onClick={() =>
                    setExpandedMix(expandedMix === mix._id ? null : mix._id)
                  }
                >
                  <td className="px-6 py-4 font-medium">{mix.name}</td>
                  <td className="px-6 py-4">{mix.notes?.slice(0, 30) || "—"}</td>
                  <td className="px-6 py-4">{mix.tags?.join(", ") || "—"}</td>
                  <td className="px-6 py-4">{mix.stockInGrams}</td>
                  <td className="px-6 py-4">€{mix.costPer100g?.toFixed(2)}</td>
                  <td className="px-6 py-4">{formulaPreview(mix.ingredients)}</td>

                  {/* ⬇️ ACTIONS + New Add Stock Button */}
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button
                      title="Expand to add stock"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedMix(mix._id);
                      }}
                    >
                      <FaPlus />
                    </button>

                    <button
                      title="Edit mix"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(mix);
                      }}
                    >
                      <FaEdit />
                    </button>

                    <button
                      title="Delete mix"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSpiceMix(mix._id);
                      }}
                    >
                      <FaTrash />
                    </button>

                    <button
                      title={mix.isActive ? "Active" : "Inactive"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(mix);
                      }}
                      className={`px-2 py-0.5 text-xs rounded ${
                        mix.isActive ? "bg-green-600" : "bg-red-600"
                      } text-white`}
                    >
                      {mix.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                </tr>

                {/* Expanded row */}
                <AnimatePresence>
                  {expandedMix === mix._id && (
                    <motion.tr
                      ref={expandedRef}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gray-700"
                    >
                      <td colSpan={7} className="px-6 py-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-lg">
                            {mix.name} Ingredients
                          </h4>
                          <button
                            onClick={() => setShowPercent(!showPercent)}
                            className="px-2 py-1 bg-accent text-accent-content rounded"
                          >
                            {showPercent ? "Show grams" : "Show %"}
                          </button>
                        </div>

                        {/* INGREDIENT TABLE */}
                        <table className="w-full border border-accent/30 text-sm mb-4">
                          <thead>
                            <tr>
                              <th className="border px-2 py-1">Ingredient</th>
                              <th className="border px-2 py-1">
                                {showPercent ? "%" : "Grams"}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {mix.ingredients.map((i) => (
                              <tr key={i._id}>
                                <td className="border px-2 py-1">{i.spice?.name}</td>
                                <td className="border px-2 py-1">
                                  {showPercent
                                    ? ((i.grams / totalGrams) * 100).toFixed(1) + "%"
                                    : i.grams + " g"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* ADD STOCK INPUT */}
                        <div className="flex gap-2 items-center mt-2">
                          <input
                            type="number"
                            className="input input-sm w-24"
                            placeholder="Grams"
                            value={stockInputs[mix._id] || ""}
                            onChange={(e) =>
                              setStockInputs((p) => ({
                                ...p,
                                [mix._id]: e.target.value,
                              }))
                            }
                          />
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleIncreaseStock(mix._id)}
                          >
                            Add Stock
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
};

export default SpiceMixList;
