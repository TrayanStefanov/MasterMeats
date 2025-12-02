import { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useSpiceStore } from "../stores/useSpiceStore";
import Pagination from "./Pagination";
import SpiceFilters from "./SpiceFilters";

const SpiceList = ({ onEdit }) => {
  const {
    spices = [],
    fetchSpices,
    deleteSpice,
    updateSpice,
    loading,
    totalCount,
    totalPages,
    currentPage,
    filters,
  } = useSpiceStore();

  const { t: tProduction } = useTranslation("admin/production");
  const { t: tCommon } = useTranslation("admin/common");

  const [expandedSpice, setExpandedSpice] = useState(null);
  const [stockInputs, setStockInputs] = useState({});

  const getRowClass = (id) =>
    expandedSpice === id ? "bg-accent/90" : "hover:bg-accent/80";

  const handleToggleActive = async (spice) => {
    await updateSpice(spice._id, { isActive: !spice.isActive });
  };

  const handleIncreaseStock = async (spiceId) => {
    const increment = parseFloat(stockInputs[spiceId]);
    if (isNaN(increment) || increment <= 0) return;
    const spice = spices.find((s) => s._id === spiceId);
    await updateSpice(spiceId, {
      stockInGrams: spice.stockInGrams + increment,
    });
    setStockInputs((prev) => ({ ...prev, [spiceId]: "" }));
  };

  useEffect(() => {
    fetchSpices(currentPage);
  }, [filters, currentPage]);

  if (loading && spices.length === 0)
    return (
      <p className="text-center py-8 text-secondary/60">
        {tCommon("loading.loading")}
      </p>
    );

  if (!spices || spices.length === 0)
    return (
      <>
        <SpiceFilters />
        <p className="text-center py-8 text-secondary/60">
          {tProduction("spices.empty", "No spices found.")}
        </p>
      </>
    );

  return (
    <>
      <SpiceFilters />
      <motion.div
        className="bg-gray-800 shadow-xl rounded-lg overflow-hidden max-w-6xl md:mx-auto mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <table className="min-w-full divide-y divide-accent-content hidden md:table">
          <thead className="bg-secondary/80 font-semibold text-primary uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">
                {tProduction("spices.list.name")}
              </th>
              <th className="px-6 py-3 text-left">
                {tProduction("spices.list.supplier")}
              </th>
              <th className="px-6 py-3 text-left">
                {tProduction("spices.list.costPerKg")}
              </th>
              <th className="px-6 py-3 text-left">
                {tProduction("spices.list.notes")}
              </th>
              <th className="px-6 py-3 text-left">
                {tProduction("spices.list.stock")}
              </th>
              <th className="px-6 py-3 text-right">
                {tProduction("spices.list.actions")}
              </th>
            </tr>
          </thead>

          <tbody className="bg-accent/70 divide-y divide-accent-content">
            {spices.map((spice) => (
              <Fragment key={spice._id}>
                <tr
                  className={`transition-colors cursor-pointer ${getRowClass(
                    spice._id
                  )}`}
                  onClick={() =>
                    setExpandedSpice(
                      expandedSpice === spice._id ? null : spice._id
                    )
                  }
                >
                  <td className="px-6 py-4 text-secondary font-medium">
                    {spice.name}
                  </td>
                  <td className="px-6 py-4 text-secondary/70">
                    {spice.supplier || "—"}
                  </td>
                  <td className="px-6 py-4 text-secondary/70">
                    €{spice.costPerKg?.toFixed(2) ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-secondary/70">
                    {spice.notes || "—"}
                  </td>
                  <td className="px-6 py-4 text-secondary/70">
                    <div className="flex justify-between gap-2">
                      <span>{spice.stockInGrams}</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Add"
                        value={stockInputs[spice._id] || ""}
                        onChange={(e) =>
                          setStockInputs((prev) => ({
                            ...prev,
                            [spice._id]: e.target.value,
                          }))
                        }
                        className="w-16 p-1 rounded-md bg-secondary text-primary border border-accent/20 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIncreaseStock(spice._id);
                        }}
                        className="p-1 bg-accent text-accent-content rounded hover:bg-accent/80 text-xs"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(spice);
                      }}
                      className={`px-2 py-0.5 text-xs rounded ${
                        spice.isActive ? "bg-green-600" : "bg-red-600"
                      } text-white`}
                    >
                      {spice.isActive ? "Active" : "Inactive"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(spice);
                      }}
                      className="text-accent-content/60 hover:text-accent-content transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSpice(spice._id);
                      }}
                      className="text-accent-content/60 hover:text-accent-content transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
        <div className="md:hidden space-y-4 p-2 bg-secondary/80">
          {spices.map((spice) => {
            const isExpanded = expandedSpice === spice._id;
            return (
              <motion.div
                key={spice._id}
                className="bg-accent rounded-lg overflow-hidden"
                layout
              >
                {/* Card Header */}
                <div
                  className="flex items-center justify-between p-3 cursor-pointer"
                  onClick={() =>
                    setExpandedSpice(isExpanded ? null : spice._id)
                  }
                >
                  <p className="text-sm font-semibold text-secondary">
                    {spice.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-secondary/70 font-medium">
                      {spice.stockInGrams}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(spice);
                      }}
                      className={`px-2 py-0.5 text-xs rounded ${
                        spice.isActive ? "bg-green-600" : "bg-red-600"
                      } text-white`}
                    >
                      {spice.isActive ? "Active" : "Inactive"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(spice);
                      }}
                      className="text-accent-content/60 hover:text-accent-content"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSpice(spice._id);
                      }}
                      className="text-accent-content/60 hover:text-accent-content"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedSpice(isExpanded ? null : spice._id);
                      }}
                      className="text-accent-content/60 hover:text-accent-content"
                    >
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>
                </div>

                {/* Expanded Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      key={`${spice._id}-details`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="bg-primary/40 px-4 py-2 text-secondary/80 text-sm space-y-2"
                    >
                      <p>Supplier: {spice.supplier || "—"}</p>
                      <p>Cost per kg: €{spice.costPerKg?.toFixed(2) ?? "—"}</p>
                      <p>Notes: {spice.notes || "—"}</p>
                      <div className="flex items-center gap-2">
                        <span>Stock: {spice.stockInGrams}</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Add stock"
                          value={stockInputs[spice._id] || ""}
                          onChange={(e) =>
                            setStockInputs((prev) => ({
                              ...prev,
                              [spice._id]: e.target.value,
                            }))
                          }
                          className="w-20 p-1 rounded-md bg-secondary text-primary border border-accent/20 text-xs"
                        />
                        <button
                          onClick={() => handleIncreaseStock(spice._id)}
                          className="p-1 bg-accent text-accent-content rounded hover:bg-accent/80 text-xs"
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
        {totalPages > 1 && spices.length > 0 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            totalCount={totalCount}
            showingCount={spices.length}
            onPageChange={(page) => fetchSpices(page)}
          />
        )}
      </motion.div>
    </>
  );
};

export default SpiceList;
