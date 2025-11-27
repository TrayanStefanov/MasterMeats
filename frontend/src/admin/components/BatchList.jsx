import { useState, Fragment, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useBatchStore } from "../stores/useBatchStore";
import { useSpiceStore } from "../stores/useSpiceStore";
import { useSpiceMixStore } from "../stores/useSpiceMixStore";

const currency = (v) => (typeof v === "number" ? `€${v.toFixed(2)}` : v ?? "—");

const prettyNumber = (v, digits = 1) =>
  typeof v === "number" ? v.toFixed(digits) : v ?? "—";

const BatchList = ({ onEdit }) => {
  const { batches = [], loading } = useBatchStore();

  // spice stores
  const { spices, fetchSpices } = useSpiceStore();
  const { spiceMixes, fetchSpiceMixes } = useSpiceMixStore();

  // local expanded state
  const [expanded, setExpanded] = useState(null);

  // ensure spices / mixes are loaded (non-blocking)
  useEffect(() => {
    if (!spices || spices.length === 0) fetchSpices();
    if (!spiceMixes || spiceMixes.length === 0) fetchSpiceMixes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // quick lookup maps
  const spicesById = useMemo(() => {
    const map = new Map();
    (spices || []).forEach((s) => map.set(s._id?.toString(), s));
    return map;
  }, [spices]);

  const mixesById = useMemo(() => {
    const map = new Map();
    (spiceMixes || []).forEach((m) => map.set(m._id?.toString(), m));
    return map;
  }, [spiceMixes]);

  const rowClass = (id) =>
    expanded === id ? "bg-accent/90" : "hover:bg-accent/80 cursor-pointer";

  if (loading && batches.length === 0)
    return (
      <p className="text-center py-8 text-secondary/60">Loading batches…</p>
    );

  if (!batches || batches.length === 0)
    return (
      <p className="text-center py-8 text-secondary/60">
        No batches created yet.
      </p>
    );
  const formatWorkTime = (minutes) => {
    if (!minutes && minutes !== 0) return "—";

    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);

    if (h === 0) return `${m} min`;
    if (m === 0) return `${h} h`;

    return `${h}h ${m}m`;
  };
  // helper to compute spice cost for a seasoning entry
  const computeEntrySpiceCost = (entry) => {
    const grams = Number(entry.spiceAmountUsed || 0); // grams
    if (entry.spiceId) {
      const spice = spicesById.get(entry.spiceId?.toString());
      if (!spice || typeof spice.costPerKg !== "number")
        return { cost: 0, name: "Unknown spice" };
      // costPerKg -> cost per gram = /1000
      const cost = (spice.costPerKg / 1000) * grams;
      return { cost, name: spice.name || "Unknown spice" };
    }
    if (entry.spiceMixId) {
      const mix = mixesById.get(entry.spiceMixId?.toString());
      if (!mix || typeof mix.costPer100g !== "number")
        return { cost: 0, name: "Unknown mix" };
      // costPer100g -> cost per gram = /100
      const cost = (mix.costPer100g / 100) * grams;
      return { cost, name: mix.name || "Unknown mix" };
    }
    return { cost: 0, name: "Unknown" };
  };

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
            <th className="px-6 py-3 text-left">Total cost</th>
            <th className="px-6 py-3 text-left">Cost / KG</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Finished</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-accent/70 divide-y divide-accent-content">
          {batches.map((batch) => {
            // compute breakdown for this row (non-expensive)
            const rawKg = batch.sourcingPhase?.amountKg || 0;
            const rawCost =
              rawKg && batch.sourcingPhase?.pricePerKg
                ? rawKg * batch.sourcingPhase.pricePerKg
                : 0;

            const paperTowelCost = batch.seasoningPhase?.paperTowelCost || 0;
            const vacuumRollCost = batch.vacuumPhase?.vacuumRollCost || 0;

            // compute spice costs and per-item list
            const seasoningEntries = batch.seasoningPhase?.entries || [];
            const spiceLines = seasoningEntries.map((e) =>
              computeEntrySpiceCost(e)
            );
            const spiceCost = spiceLines.reduce((s, l) => s + (l.cost || 0), 0);

            const computedTotal =
              rawCost + paperTowelCost + vacuumRollCost + spiceCost;

            return (
              <Fragment key={batch._id}>
                {/* MAIN ROW */}
                <tr
                  className={`transition-colors ${rowClass(batch._id)}`}
                  onClick={() =>
                    setExpanded(expanded === batch._id ? null : batch._id)
                  }
                >
                  <td className="px-6 py-4 text-secondary font-medium">
                    {batch.batchNumber ?? batch._id.slice(-6)}
                  </td>

                  <td className="px-6 py-4 text-secondary/70">
                    {typeof batch.driedTotal === "number"
                      ? batch.driedTotal
                      : "—"}
                  </td>

                  <td className="px-6 py-4 text-secondary/70">
                    {batch.totalCost
                      ? currency(batch.totalCost)
                      : currency(computedTotal)}
                  </td>

                  <td className="px-6 py-4 text-secondary/70">
                    {batch.costPerKgDried
                      ? currency(batch.costPerKgDried)
                      : "—"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        batch.finishTime
                          ? "bg-green-600 text-white"
                          : "bg-yellow-600 text-white"
                      }`}
                    >
                      {batch.finishTime ? "Complete" : "In Progress"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-secondary/70">
                    {batch.finishTime ? batch.finishTime.split("T")[0] : "—"}
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
                        setExpanded(expanded === batch._id ? null : batch._id);
                      }}
                      className="text-accent-content/60 hover:text-accent-content transition-colors"
                    >
                      {expanded === batch._id ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                  </td>
                </tr>

                {/* EXPANDED INFO */}
                {expanded === batch._id && (
                  <tr className="bg-accent/50">
                    <td colSpan="8" className="px-16 py-10 text-secondary">
                      <h3 className="font-bold text-accent-content text-3xl mb-8 text-center">
                        Batch #{batch.batchNumber ?? batch._id.slice(-6)} Info
                      </h3>

                      <div className="flex justify-between gap-6">
                        {/* COLUMN 1 — TIME */}
                        <div className="flex-1">
                          <h4 className="font-bold text-accent-content text-xl mb-2 text-center">
                            Time
                          </h4>
                          <p>
                            <strong>Start:</strong>{" "}
                            {batch.startTime
                              ? new Date(batch.startTime).toLocaleString()
                              : "—"}
                            <br />
                            <strong>Finish:</strong>{" "}
                            {batch.finishTime
                              ? new Date(batch.finishTime).toLocaleString()
                              : "—"}
                            <br />
                            <br />
                            <strong>Curing in salt:</strong>{" "}
                            <p>
                              {formatWorkTime(batch.curingPhase?.timeInSaltMinutes)}
                              </p>
                            <br />
                            <strong>Curing in liquid:</strong>{" "}
                            <p>
                              {formatWorkTime(batch.curingPhase?.timeInLiquidMinutes)}
                              </p>
                              
                            <br />
                            <br />
                            <strong>Total Work Time:</strong>{" "}
                            <p>{formatWorkTime(batch.totalWorkTime)}</p>
                            <br />
                            <strong>Total Production Time:</strong>{" "}
                            {batch.totalElapsedTimeHours
                              ? prettyNumber(batch.totalElapsedTimeHours, 2) +
                                " hrs"
                              : "—"}
                          </p>
                        </div>

                        {/* COLUMN 2 — COST */}
                        <div className="flex-1">
                          <h4 className="font-bold text-accent-content text-xl mb-2 text-center">
                            Cost
                          </h4>

                          <div className="space-y-2">
                            <div>
                              <strong>Raw meat:</strong>{" "}
                              {rawCost ? currency(rawCost) : currency(0)}{" "}
                              <span className="text-sm text-secondary/70">
                                ({rawKg ?? 0} kg @{" "}
                                {batch.sourcingPhase?.pricePerKg
                                  ? currency(batch.sourcingPhase.pricePerKg)
                                  : "—"}
                                /kg)
                              </span>
                            </div>

                            <div>
                              <strong>Salt used:</strong>{" "}
                              {batch.curingPhase?.saltAmountKg
                                ? `${batch.curingPhase.saltAmountKg} kg`
                                : "—"}
                            </div>

                            <div>
                              <strong>Spices</strong>{" "}
                              <span className="text-sm text-secondary/70">
                                ({seasoningEntries.length} entries)
                              </span>
                              <div className="mt-2 ml-3">
                                {seasoningEntries.length === 0 && (
                                  <div className="text-secondary/60">
                                    No spices recorded
                                  </div>
                                )}
                                {seasoningEntries.map((e, i) => {
                                  const { cost, name } =
                                    computeEntrySpiceCost(e);
                                  return (
                                    <div
                                      key={i}
                                      className="flex justify-between"
                                    >
                                      <div className="truncate text-sm">
                                        {name} — {e.spiceAmountUsed ?? 0} g
                                      </div>
                                      <div className="text-sm">
                                        {currency(cost)}
                                      </div>
                                    </div>
                                  );
                                })}
                                {seasoningEntries.length > 0 && (
                                  <div className="mt-2 border-t pt-2">
                                    <strong>Total spices:</strong>{" "}
                                    {currency(spiceCost)}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <strong>Paper towels:</strong>{" "}
                              {currency(paperTowelCost)}
                            </div>

                            <div>
                              <strong>Vacuum rolls:</strong>{" "}
                              {currency(vacuumRollCost)}
                            </div>

                            <div className="mt-3 border-t pt-2">
                              <strong>Computed total:</strong>{" "}
                              {currency(computedTotal)}
                            </div>
                          </div>
                        </div>

                        {/* COLUMN 3 — DETAILS */}
                        <div className="flex-1">
                          <h4 className="font-bold text-accent-content text-xl mb-2 text-center">
                            Details
                          </h4>
                          <p>
                            <strong>Raw meat:</strong>{" "}
                            {batch.sourcingPhase?.amountKg ?? "—"} kg
                            <br />
                            <strong>Waste:</strong>{" "}
                            {batch.preppingPhase?.wasteKg ?? "—"} kg
                            <br />
                            <strong>Cooking cuts:</strong>{" "}
                            {batch.preppingPhase?.cookingCutsKg ?? "—"} kg
                            <br />
                            <br />
                            {batch.curingPhase?.saltAmountKg &&
                            batch.sourcingPhase?.amountKg ? (
                              <>
                                <strong>Salt g/kg:</strong>{" "}
                                {(
                                  (batch.curingPhase.saltAmountKg * 1000) /
                                  batch.sourcingPhase.amountKg
                                ).toFixed(1) || 0}{" "}
                                g/kg
                              </>
                            ) : null}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
};

export default BatchList;
