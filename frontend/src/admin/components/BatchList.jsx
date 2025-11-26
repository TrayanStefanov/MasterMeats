import { useState, Fragment } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useBatchStore } from "../stores/useBatchStore";

const BatchList = ({ onEdit }) => {
  const { batches = [], loading } = useBatchStore();
  const [expanded, setExpanded] = useState(null);

  const rowClass = (id) =>
    expanded === id ? "bg-accent/90" : "hover:bg-accent/80 cursor-pointer";

  if (loading && batches.length === 0)
    return <p className="text-center py-8 text-secondary/60">Loading batches…</p>;

  if (!batches || batches.length === 0)
    return (
      <p className="text-center py-8 text-secondary/60">
        No batches created yet.
      </p>
    );

  return (
    <motion.div
      className="bg-gray-800 shadow-xl rounded-lg overflow-hidden max-w-6xl mx-auto mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <table className="min-w-full divide-y divide-accent-content">
        <thead className="bg-secondary/80 font-semibold text-primary uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-3 text-left">Batch #</th>
            <th className="px-6 py-3 text-left">Dried KG</th>
            <th className="px-6 py-3 text-left">Raw KG</th>
            <th className="px-6 py-3 text-left">Cost / KG</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Started</th>
            <th className="px-6 py-3 text-left">Finished</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-accent/70 divide-y divide-accent-content">
          {batches.map((batch) => (
            <Fragment key={batch._id}>
              {/* MAIN ROW */}
              <tr
                className={`transition-colors ${rowClass(batch._id)}`}
                onClick={() =>
                  setExpanded(expanded === batch._id ? null : batch._id)
                }
              >
                <td className="px-6 py-4 text-secondary font-medium">
                  {batch.batchNumber || batch._id.slice(-6)}
                </td>

                <td className="px-6 py-4 text-secondary/70">
                  {batch.metrics?.totalDriedKg ?? "—"}
                </td>

                <td className="px-6 py-4 text-secondary/70">
                  {batch.metrics?.totalRawKg ?? "—"}
                </td>

                <td className="px-6 py-4 text-secondary/70">
                  {batch.metrics?.costPerKgDried
                    ? "€" + batch.metrics.costPerKgDried.toFixed(2)
                    : "—"}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      batch.status === "complete"
                        ? "bg-green-600 text-white"
                        : "bg-yellow-600 text-white"
                    }`}
                  >
                    {batch.status || "In Progress"}
                  </span>
                </td>

                <td className="px-6 py-4 text-secondary/70">
                  {batch.dateStarted ? batch.dateStarted.split("T")[0] : "—"}
                </td>

                <td className="px-6 py-4 text-secondary/70">
                  {batch.dateFinished ? batch.dateFinished.split("T")[0] : "—"}
                </td>

                <td className="px-6 py-4 text-right flex justify-end gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(batch);
                    }}
                    className="text-accent-content/60 hover:text-accent-content transition-colors"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(
                        expanded === batch._id ? null : batch._id
                      );
                    }}
                    className="text-accent-content/60 hover:text-accent-content transition-colors"
                  >
                    {expanded === batch._id ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </td>
              </tr>

              {/* EXPANDED INFO */}
              {expanded === batch._id && (
                <tr className="bg-accent/50">
                  <td colSpan="8" className="px-6 py-4 text-secondary">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-bold text-primary">Total Time</h4>
                        <p>{batch.metrics?.totalTime ?? "—"}</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-primary">Cost</h4>
                        <p>
                          {batch.metrics?.totalCost
                            ? "€" + batch.metrics.totalCost.toFixed(2)
                            : "—"}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-primary">Raw / Waste</h4>
                        <p>
                          Raw: {batch.metrics?.totalRawKg ?? "—"} kg<br />
                          Waste: {batch.metrics?.wasteKg ?? "—"} kg
                        </p>
                      </div>
                    </div>

                    {/* Cooking Info */}
                    <div className="mt-4">
                      <h4 className="font-bold text-primary">Cooking</h4>
                      <pre className="whitespace-pre-wrap opacity-80">
                        {batch?.cookingNotes || "No cooking notes."}
                      </pre>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default BatchList;
