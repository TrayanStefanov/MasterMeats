import { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

import { useSpiceMixStore } from "../stores/useSpiceMixStore";
import Pagination from "./Pagination";
import SpiceMixFilters from "./SpiceMixFilters";
import { t } from "i18next";

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

  const {t:tProduction} = useTranslation("admin/production");
  const {t:tCommon} = useTranslation("admin/common");

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
      ? `${names.join(", ")}, +${remaining} ${tCommon("loading.more")}`
      : names.join(", ");
  };

  if (loading && spiceMixes.length === 0)
    return (
      <p className="text-center py-8 text-secondary/60">{tCommon("loading.loading")}.</p>
    );

  if (!spiceMixes.length)
    return (
      <>
        <SpiceMixFilters />
        <p className="text-center py-8 text-secondary/60">
          {tProduction("spiceMix.empty")}
        </p>
      </>
    );

  return (
    <>
      <SpiceMixFilters />
      <motion.div
        className="bg-gray-800 shadow-xl rounded-lg overflow-hidden max-w-6xl md:mx-auto mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <table className="min-w-full divide-y divide-accent-content hidden md:table">
          <thead className="bg-secondary/80 font-semibold text-primary uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">{tProduction("spiceMix.list.name")}</th>
              <th className="px-6 py-3 text-left">{tProduction("spiceMix.list.tags")}</th>
              <th className="px-6 py-3 text-left">{tProduction("spiceMix.list.stock")}</th>
              <th className="px-6 py-3 text-left">{tProduction("spiceMix.list.cost")}</th>
              <th className="px-6 py-3 text-left hidden lg:table-cell">{tProduction("spiceMix.list.ingredients")}</th>
              <th className="px-6 py-3 text-right">{tProduction("spiceMix.list.actions")}</th>
              <th className="px-6 py-3 text-right">{tProduction("spiceMix.list.isActive")}</th>
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
                      {mix.tags?.join(", ") || "—"}
                    </td>
                    <td className="px-6 py-4 text-secondary/70">
                      <div className="flex items-center gap-2">
                        <span>{mix.stockInGrams} {tCommon("units.grams")}</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder={tProduction("spiceMix.list.addStockPlaceholder")}
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
                          title={tCommon("buttons.addSpiceMixStock")}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-secondary/70">
                      €{mix.costPer100g?.toFixed(2) ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-secondary/70 hidden lg:table-cell">
                      {formulaPreview(mix.ingredients)}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(mix);
                        }}
                        className="text-accent-content/60 hover:text-accent-content transition-colors"
                        title={tCommon("buttons.updateSpiceMix")}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSpiceMix(mix._id);
                        }}
                        className="text-accent-content/60 hover:text-accent-content transition-colors"
                        title={tCommon("buttons.deleteSpiceMix")}
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
                        title={mix.isActive ? tCommon("buttons.deactivate") : tCommon("buttons.activate")}
                      >
                        {mix.isActive ? tCommon("status.active") : tCommon("status.inactive")}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded ingredient table */}
                  <AnimatePresence>
                    {expandedMix === mix._id && (
                      <motion.tr
                        key={`${mix._id}-details`}
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
                          {/* Header */}
                          <p className="text-center text-secondary font-semibold text-base mb-4 border-b border-accent/40 pb-2">
                            {tProduction("spiceMix.list.details")} {mix.name}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Ingredients */}
                            <div>
                              <h4 className="text-secondary font-semibold mb-2 text-sm uppercase tracking-wide">
                                {tProduction("spiceMix.list.ingredients")}
                              </h4>
                              <div className="space-y-1 bg-primary p-3 rounded-lg border border-accent/30">
                                {mix.ingredients.map((i) => (
                                  <div
                                    key={i._id}
                                    className="flex justify-between text-secondary/70 text-sm"
                                  >
                                    <span>{i.spice?.name}</span>
                                    <span className="text-secondary/50">
                                      {showPercent
                                        ? (
                                            (i.grams / totalGrams) *
                                            100
                                          ).toFixed(1) + "%"
                                        : i.grams + ' ' + tCommon("units.grams")}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <button
                                onClick={() => setShowPercent(!showPercent)}
                                className="mt-2 px-2 py-1 bg-accent text-accent-content rounded text-xs"
                                title={showPercent ? tCommon("buttons.showGrams") : tCommon("buttons.showPercent")}
                                >
                                {showPercent ? tCommon("buttons.showGrams") : tCommon("buttons.showPercent")}
                              </button>
                            </div>

                            {/* Notes */}
                            <div>
                              <h4 className="text-secondary font-semibold mb-2 text-sm uppercase tracking-wide">
                                {tProduction("spiceMix.list.notes")}
                              </h4>
                              <div className="bg-primary p-3 rounded-lg border border-accent/30 min-h-[100px]">
                                {mix.note ? (
                                  <p className="text-secondary/70 leading-relaxed whitespace-pre-wrap">
                                    {mix.note}
                                  </p>
                                ) : (
                                  <p className="text-secondary/40 italic">
                                    {tProduction("spiceMix.list.noNotes")}
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
              );
            })}
          </tbody>
        </table>
        {/* Mobile cards */}
        <div className="md:hidden space-y-4 p-2 bg-secondary/80">
          {spiceMixes.map((mix) => {
            const isExpanded = expandedMix === mix._id;
            const totalGrams = mix.ingredients.reduce(
              (sum, i) => sum + i.grams,
              0
            );

            return (
              <motion.div
                key={mix._id}
                className="bg-accent rounded-lg overflow-hidden"
                layout
              >
                {/* Card Header */}
                <div
                  className="flex items-center justify-between p-3 cursor-pointer"
                  onClick={() => setExpandedMix(isExpanded ? null : mix._id)}
                >
                  <p className="text-sm font-semibold text-secondary">
                    {mix.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-secondary/70 font-medium">
                      {mix.stockInGrams} {tCommon("units.grams")}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(mix);
                      }}
                      className={`px-2 py-0.5 text-xs rounded ${
                        mix.isActive ? "bg-green-600" : "bg-red-600"
                      } text-white`}
                      title={mix.isActive ? tCommon("buttons.deactivate") : tCommon("buttons.deactivate")}
                    >
                      {mix.isActive ? tCommon("buttons.activate") : tCommon("buttons.deactivate")}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(mix);
                      }}
                      className="text-accent-content/60 hover:text-accent-content"
                      title={tCommon("buttons.updateSpiceMix")}
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSpiceMix(mix._id);
                      }}
                      className="text-accent-content/60 hover:text-accent-content"
                      title={tCommon("buttons.deleteSpiceMix")}
                    >
                      <FaTrash />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedMix(isExpanded ? null : mix._id);
                      }}
                      className="text-accent-content/60 hover:text-accent-content"
                      title={isExpanded ? tCommon("buttons.hideDetails") : tCommon("buttons.showDetails")}
                    >
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>
                </div>

                {/* Expanded section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      key={`${mix._id}-details`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="bg-primary/40 px-4 py-2 text-secondary/80 text-sm space-y-2"
                    >
                      <p>{tProduction("spiceMix.list.tags")}: {mix.tags?.join(", ") || "—"}</p>
                      <p>
                        {tProduction("spiceMix.list.cost")} {' '} : €{mix.costPer100g?.toFixed(2) ?? "—"}
                      </p>

                      {/* Ingredients */}
                      {mix.ingredients?.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-1">{tProduction("spiceMix.list.ingredients")}</h4>
                          <div className="space-y-1 bg-primary p-2 rounded border border-accent/30">
                            {mix.ingredients.map((i) => (
                              <div
                                key={i._id}
                                className="flex justify-between text-secondary/70 text-sm"
                              >
                                <span>{i.spice?.name}</span>
                                <span className="text-secondary/50">
                                  {showPercent
                                    ? ((i.grams / totalGrams) * 100).toFixed(
                                        1
                                      ) + "%"
                                    : i.grams + " " + tCommon("units.grams")}
                                </span>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => setShowPercent(!showPercent)}
                            className="mt-2 px-2 py-1 bg-accent text-accent-content rounded text-xs"
                            title={showPercent ? tCommon("buttons.showGrams") : tCommon("buttons.showPercent")}
                            >
                            {showPercent ? tCommon("buttons.showGrams") : tCommon("buttons.showPercent")}
                          </button>
                        </div>
                      )}

                      {/* Notes */}
                      <div>
                        <h4 className="font-semibold mb-1">{tProduction("spiceMix.list.notes")}</h4>
                        <div className="bg-primary p-2 rounded border border-accent/30 min-h-[80px]">
                          {mix.note ? (
                            <p className="text-secondary/70 whitespace-pre-wrap">
                              {mix.note}
                            </p>
                          ) : (
                            <p className="text-secondary/40 italic">
                              {tProduction("spiceMix.list.noNotes")}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Stock input inside expanded section */}
                      <div className="flex items-center gap-2 mt-2">
                        <span>{tProduction("spiceMix.list.stockMobile")}: {mix.stockInGrams} {tCommon("units.grams")}</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder = {tProduction("spiceMix.list.addStockPlaceholder")}
                          value={stockInputs[mix._id] || ""}
                          onChange={(e) =>
                            setStockInputs((prev) => ({
                              ...prev,
                              [mix._id]: e.target.value,
                            }))
                          }
                          className="w-20 p-1 rounded-md bg-secondary text-primary border border-accent/20 text-xs"
                        />
                        <button
                          onClick={() => handleIncreaseStock(mix._id)}
                          className="p-1 bg-accent text-accent-content rounded hover:bg-accent/80 text-xs"
                          title={tCommon("buttons.addSpiceMixStock")}
                        >
                          <FaPlus />

                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
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
