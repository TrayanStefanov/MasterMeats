import { useState, useEffect, Fragment } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { useSpiceMixStore } from "../stores/useSpiceMixStore";
import Pagination from "./Pagination";
import SpiceMixFilters from "./SpiceMixFilters";

const SpiceMixList = ({ onEdit }) => {
  const {
    spiceMixes = [],
    deleteSpiceMix,
    updateSpiceMix,
    addStockToMix,
    loading,
    totalCount,
    totalPages,
    currentPage,
    filters,
    fetchSpiceMixes,
  } = useSpiceMixStore();

  const [expandedMix, setExpandedMix] = useState(null);
  const [showPercent, setShowPercent] = useState(false);
  const [stockInputs, setStockInputs] = useState({});

  const getRowClass = (id) =>
    expandedMix === id ? "bg-accent/90" : "hover:bg-accent/80";

  const handleToggleActive = async (mix) => {
    await updateSpiceMix(mix._id, { isActive: !mix.isActive });
  };

  const handleIncreaseStock = async (mixId) => {
    const increment = parseFloat(stockInputs[mixId]);
    if (isNaN(increment) || increment <= 0) return;

    await addStockToMix(mixId, increment);
    setStockInputs((prev) => ({ ...prev, [mixId]: "" }));
  };

  useEffect(() => {
    fetchSpiceMixes(currentPage);
  }, [filters, currentPage]);

  const formulaPreview = (ingredients) => {
    if (!ingredients?.length) return "";
    const names = ingredients.slice(0, 2).map((i) => i.spice?.name);
    const remaining = ingredients.length - 2;
    return remaining > 0
      ? `${names.join(", ")}, +${remaining} more...`
      : names.join(", ");
  };

  if (loading && spiceMixes.length === 0)
    return (
      <p className="text-center py-8 text-secondary/60">Loading mixes...</p>
    );

  if (!spiceMixes.length)
    return (
      <>
        <SpiceMixFilters />
        <p className="text-center py-8 text-secondary/60">
          No spice mixes found.
        </p>
      </>
    );

  return (
    <>
      <SpiceMixFilters />
      <motion.div
        className="bg-gray-800 shadow-xl rounded-lg overflow-hidden max-w-6xl mx-auto mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
              <th className="px-6 py-3 text-right">Active</th>
            </tr>
          </thead>

          <tbody className="bg-accent/70 divide-y divide-accent-content">
            {spiceMixes.map((mix) => {
              const totalGrams = mix.ingredients.reduce(
                (sum, i) => sum + i.grams,
                0
              );

              return (
                <Fragment key={mix._id}>
                  <tr
                    className={`transition-colors cursor-pointer ${getRowClass(
                      mix._id
                    )}`}
                    onClick={() =>
                      setExpandedMix(expandedMix === mix._id ? null : mix._id)
                    }
                  >
                    <td className="px-6 py-4 text-secondary font-medium">
                      {mix.name}
                    </td>
                    <td className="px-6 py-4 text-secondary/70">
                      {mix.notes?.slice(0, 30) || "—"}
                    </td>
                    <td className="px-6 py-4 text-secondary/70">
                      {mix.tags?.join(", ") || "—"}
                    </td>
                    <td className="px-6 py-4 text-secondary/70">
                      <div className="flex items-center gap-2">
                        <span>{mix.stockInGrams}</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Add"
                          value={stockInputs[mix._id] || ""}
                          onChange={(e) =>
                            setStockInputs((prev) => ({
                              ...prev,
                              [mix._id]: e.target.value,
                            }))
                          }
                          className="w-16 p-1 rounded-md bg-secondary text-primary border border-accent/20 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIncreaseStock(mix._id);
                          }}
                          className="p-1 bg-accent text-accent-content rounded hover:bg-accent/80 text-xs"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-secondary/70">
                      €{mix.costPer100g?.toFixed(2) ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-secondary/70">
                      {formulaPreview(mix.ingredients)}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(mix);
                        }}
                        className="text-accent-content/60 hover:text-accent-content transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSpiceMix(mix._id);
                        }}
                        className="text-accent-content/60 hover:text-accent-content transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </td>
                    <td className="justify-items-center-center gap-2">
                      <button
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

                  {/* Expanded ingredient table */}
                  {expandedMix === mix._id && (
                    <tr className="bg-gray-700">
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
                                <td className="border px-2 py-1">
                                  {i.spice?.name}
                                </td>
                                <td className="border px-2 py-1">
                                  {showPercent
                                    ? ((i.grams / totalGrams) * 100).toFixed(
                                        1
                                      ) + "%"
                                    : i.grams + " g"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {totalPages > 1 && spiceMixes.length > 0 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            totalCount={totalCount}
            showingCount={spiceMixes.length}
            onPageChange={(page) => fetchSpiceMixes(page)}
          />
        )}
      </motion.div>
    </>
  );
};

export default SpiceMixList;
