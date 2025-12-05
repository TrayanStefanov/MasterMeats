import { useState, Fragment, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import { useBatchStore } from "../stores/useBatchStore";
import { useSpiceStore } from "../stores/useSpiceStore";
import { useSpiceMixStore } from "../stores/useSpiceMixStore";

const currency = (v) => (typeof v === "number" ? `€${v.toFixed(2)}` : v ?? "—");

const prettyNumber = (v, digits = 1) =>
  typeof v === "number" ? v.toFixed(digits) : v ?? "—";

const BatchList = ({ onEdit }) => {
  const { batches = [], loading } = useBatchStore();

  const { t: tCommon } = useTranslation("admin/common");
  const { t: tProduction } = useTranslation("admin/production");
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
      <p className="text-center py-8 text-secondary/60">{tCommon("loading.loading")}</p>
    );

  if (!batches || batches.length === 0)
    return (
      <p className="text-center py-8 text-secondary/60">
        {tProduction("batchList.empty")}
      </p>
    );
  const formatWorkTime = (minutes) => {
    if (!minutes && minutes !== 0) return "—";

    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);

    if (h === 0) return `${m}${tCommon("units.minutes")}`;
    if (m === 0) return `${h}${tCommon("units.hours")}`;

    return `${h}${tCommon("units.hours")} ${m}${tCommon("units.minutes")}`;
  };
  // helper to compute spice cost for a seasoning entry
  const computeEntrySpiceCost = (entry) => {
    const grams = Number(entry.spiceAmountUsed || 0); // grams
    if (entry.spiceId) {
      const spice = spicesById.get(entry.spiceId?.toString());
      if (!spice || typeof spice.costPerKg !== "number")
        return { cost: 0, name: tProduction("batches.warning.spice") };
      // costPerKg -> cost per gram = /1000
      const cost = (spice.costPerKg / 1000) * grams;
      return { cost, name: spice.name || tProduction("batches.warning.spice") };
    }
    if (entry.spiceMixId) {
      const mix = mixesById.get(entry.spiceMixId?.toString());
      if (!mix || typeof mix.costPer100g !== "number")
        return { cost: 0, name: tProduction("batches.warning.spiceMix") };
      // costPer100g -> cost per gram = /100
      const cost = (mix.costPer100g / 100) * grams;
      return { cost, name: mix.name || tProduction("batches.warning.spiceMix") };
    }
    return { cost: 0, name: tProduction("batches.warning.unknown") };
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-xl rounded-lg overflow-hidden max-w-6xl md:mx-auto mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <table className="min-w-full divide-y divide-accent-conten hidden md:table">
        <thead className="bg-secondary/80 font-semibold text-primary uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-3 text-left">{tProduction("batches.list.id")}</th>
            <th className="px-6 py-3 text-left">{tProduction("batches.list.driedKg")}</th>
            <th className="px-6 py-3 text-left">{tProduction("batches.list.totalCost")}</th>
            <th className="px-6 py-3 text-left">{tProduction("batches.list.costPerKg")}</th>
            <th className="px-6 py-3 text-left">{tProduction("batches.list.status")}</th>
            <th className="px-6 py-3 text-left">{tProduction("batches.list.finished")}</th>
            <th className="px-6 py-3 text-right">{tProduction("batches.list.actions")}</th>
          </tr>
        </thead>

        <tbody className="bg-accent/70 divide-y divide-accent-content">
          {batches.map((batch) => {
            // compute breakdown for this row (non-expensive)
            const rawKg = batch.sourcingPhase?.amountInGrams / 1000 || 0;
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
                    {batch.finishTime ? tCommon("status.complete") : tCommon("status.inProcess")}
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
                      titel={tCommon("buttons.updateBatch")}
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(expanded === batch._id ? null : batch._id);
                      }}
                      className="text-accent-content/60 hover:text-accent-content transition-colors"
                      title={expanded === batch._id ? tCommon("buttons.hideDetails") : tCommon("buttons.showDetails")}
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
                        {tProduction("batches.list.detailsFor")} {tProduction("batches.list.id")}{batch.batchNumber ?? batch._id.slice(-6)}
                      </h3>

                      <div className="flex justify-between gap-6">
                        {/* COLUMN 1 — TIME */}
                        <div className="flex-1">
                          <h4 className="font-bold text-accent-content text-xl mb-2 text-center">
                            {tProduction("batches.list.time.title")}
                          </h4>
                          <p>
                            <strong>{tProduction("batches.list.time.start")}:</strong>{" "}
                            {batch.startTime
                              ? new Date(batch.startTime).toLocaleString()
                              : "—"}
                            <br />
                            <strong>{tProduction("batches.list.time.finish")}:</strong>{" "}
                            {batch.finishTime
                              ? new Date(batch.finishTime).toLocaleString()
                              : "—"}
                            <br />
                            <br />
                            <strong>{tProduction("batches.list.time.curingSalt")}:</strong>{" "}
                            <p>
                              {formatWorkTime(
                                batch.curingPhase?.timeInSaltMinutes
                              )}
                            </p>
                            <br />
                            <strong>{tProduction("batches.list.time.curingLiquid")}:</strong>{" "}
                            <p>
                              {formatWorkTime(
                                batch.curingPhase?.timeInLiquidMinutes
                              )}
                            </p>
                            <br />
                            <br />
                            <strong>{tProduction("batches.list.time.totalWorkTime")}:</strong>{" "}
                            <p>{formatWorkTime(batch.totalWorkTime)}</p>
                            <br />
                            <strong>{tProduction("batches.list.time.totalProductionTime")}</strong>{" "}
                            {batch.totalElapsedTimeHours
                              ? prettyNumber(batch.totalElapsedTimeHours, 2) +
                                "" + tCommon("units.hours")
                              : "—"}
                          </p>
                        </div>

                        {/* COLUMN 2 — COST */}
                        <div className="flex-1">
                          <h4 className="font-bold text-accent-content text-xl mb-2 text-center">
                            {tProduction("batches.list.cost.title")}
                          </h4>

                          <div className="space-y-2">
                            <div>
                              <strong>{tProduction("batches.list.cost.rawMeat")}:</strong>{" "}
                              {rawCost ? currency(rawCost) : currency(0)}{" "}
                              <span className="text-sm text-secondary/70">
                                ({rawKg ?? 0} {tCommon("units.kg")} @{" "}
                                {batch.sourcingPhase?.pricePerKg
                                  ? currency(batch.sourcingPhase.pricePerKg)
                                  : "—"}
                                /{tCommon("units.kg")})
                              </span>
                            </div>

                            <div>
                              <strong>{tProduction("batches.list.cost.salt")}:</strong>{" "}
                              {batch.curingPhase?.saltAmountInGrams
                                ? `${
                                    batch.curingPhase.saltAmountInGrams / 1000
                                  } ${tCommon("units.kg")}`
                                : "—"}
                            </div>

                            <div>
                              <strong>{tProduction("batches.list.cost.spices")}:</strong>{" "}
                              <span className="text-sm text-secondary/70">
                                ({seasoningEntries.length} entries)
                              </span>
                              <div className="mt-2 ml-3">
                                {seasoningEntries.length === 0 && (
                                  <div className="text-secondary/60">
                                    {tProduction("batches.list.cost.noSpices")}
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
                                        {name} — {e.spiceAmountUsed ?? 0} {tCommon("units.g")}
                                      </div>
                                      <div className="text-sm">
                                        {currency(cost)}
                                      </div>
                                    </div>
                                  );
                                })}
                                {seasoningEntries.length > 0 && (
                                  <div className="mt-2 border-t pt-2">
                                    <strong>{tProduction("batches.list.cost.totalSpice")}</strong>{" "}
                                    {currency(spiceCost)}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <strong>{tProduction("batches.list.cost.paperTowel")}:</strong>{" "}
                              {currency(paperTowelCost)}
                            </div>

                            <div>
                              <strong>{tProduction("batches.list.cost.vacuumRolls")}:</strong>{" "}
                              {currency(vacuumRollCost)}
                            </div>

                            <div className="mt-3 border-t pt-2">
                              <strong>{tProduction("batches.list.cost.totalCost")}</strong>{" "}
                              {currency(computedTotal)}
                            </div>
                          </div>
                        </div>

                        {/* COLUMN 3 — DETAILS */}
                        <div className="flex-1">
                          <h4 className="font-bold text-accent-content text-xl mb-2 text-center">
                            {tProduction("batches.list.details.title")}
                          </h4>
                          <p>
                            <strong>{tProduction("batches.list.details.rawMeat")}:</strong>{" "}
                            {(batch.sourcingPhase?.amountInGrams ?? 0) / 1000}{" "}
                            {tCommon("units.kg")}
                            <br />
                            <strong>{tProduction("batches.list.details.wasteMeat")}:</strong>{" "}
                            {(batch.preppingPhase?.wasteInGrams ?? 0) / 1000} {tCommon("units.kg")}
                            <br />
                            <strong>{tProduction("batches.list.details.meatForCooking")}</strong>{" "}
                            {(batch.preppingPhase?.cookingCutsIngrams ?? 0) /
                              1000}{" "} {tCommon("units.kg")}                            
                            <br />
                            <br />
                            {batch.curingPhase?.saltAmountInGrams &&
                            batch.sourcingPhase?.amountKg ? (
                              <>
                                <strong>{tProduction("batches.list.details.salt")}</strong>{" "}
                                {(
                                  batch.curingPhase.saltAmountInGrams /
                                  batch.sourcingPhase.amountKg
                                ).toFixed(1) || 0}{" "}
                                {tCommon("units.g")}/{tCommon("units.kg")}
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
      <div className="md:hidden space-y-4 p-2 bg-secondary/80">
        {batches.map((batch) => {
          const isExpanded = expanded === batch._id;

          const rawKg = batch.sourcingPhase?.amountInGrams / 1000 || 0;
          const rawCost =
            rawKg && batch.sourcingPhase?.pricePerKg
              ? rawKg * batch.sourcingPhase.pricePerKg
              : 0;
          const paperTowelCost = batch.seasoningPhase?.paperTowelCost || 0;
          const vacuumRollCost = batch.vacuumPhase?.vacuumRollCost || 0;
          const seasoningEntries = batch.seasoningPhase?.entries || [];
          const spiceLines = seasoningEntries.map((e) =>
            computeEntrySpiceCost(e)
          );
          const spiceCost = spiceLines.reduce((s, l) => s + (l.cost || 0), 0);
          const computedTotal =
            rawCost + paperTowelCost + vacuumRollCost + spiceCost;

          return (
            <motion.div
              key={batch._id}
              className="bg-accent rounded-lg overflow-hidden"
              layout
            >
              {/* HEADER */}
              <div
                className={`flex items-center justify-between p-3 ${rowClass(
                  batch._id
                )}`}
                onClick={() => setExpanded(isExpanded ? null : batch._id)}
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-secondary">
                    {tProduction("batches.list.id")}{batch.batchNumber ?? batch._id.slice(-6)}
                  </span>
                  <span className="text-secondary/70">
                    {tProduction("batches.list.driedKg")} {batch.driedTotal ?? "—"} {tCommon("units.kg")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-xs rounded ${
                      batch.finishTime
                        ? "bg-green-600 text-white"
                        : "bg-yellow-600 text-white"
                    }`}
                  >
                    {batch.finishTime ? tCommon("status.complete") : tCommon("status.inProcess")}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(batch);
                    }}
                    className="text-accent-content/60 hover:text-accent-content"
                    title={tCommon("buttons.updateBatch")}
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(isExpanded ? null : batch._id);
                    }}
                    className="text-accent-content/60 hover:text-accent-content"
                    title={isExpanded ? tCommon("buttons.hideDetails") : tCommon("buttons.showDetails")}
                  >
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>

              {/* EXPANDED INFO */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    key={`${batch._id}-details`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="bg-primary/40 px-4 py-3 text-secondary/80 text-sm space-y-2"
                  >
                    <div>
                      <h4 className="font-bold text-accent-content text-xl mb-2 text-center">
                        {tProduction("batches.list.time.title")}
                      </h4>
                      <p>
                            <strong>{tProduction("batches.list.time.start")}:</strong>{" "}
                            {batch.startTime
                              ? new Date(batch.startTime).toLocaleString()
                              : "—"}
                            <br />
                            <strong>{tProduction("batches.list.time.finish")}:</strong>{" "}
                            {batch.finishTime
                              ? new Date(batch.finishTime).toLocaleString()
                              : "—"}
                            <br />
                            <br />
                            <strong>{tProduction("batches.list.time.curingSalt")}:</strong>{" "}
                            <p>
                              {formatWorkTime(
                                batch.curingPhase?.timeInSaltMinutes
                              )}
                            </p>
                            <strong>{tProduction("batches.list.time.curingLiquid")}:</strong>{" "}
                            <p>
                              {formatWorkTime(
                                batch.curingPhase?.timeInLiquidMinutes
                              )}
                            </p>
                            <strong>{tProduction("batches.list.time.totalWorkTime")}:</strong>{" "}
                            <p>{formatWorkTime(batch.totalWorkTime)}</p>
                            <strong>{tProduction("batches.list.time.totalProductionTime")}</strong>{" "}
                            {batch.totalElapsedTimeHours
                              ? prettyNumber(batch.totalElapsedTimeHours, 2) +
                                "" + tCommon("units.hours")
                              : "—"}
                          </p>
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold text-accent-content text-xl mb-2 text-center">
                            {tProduction("batches.list.cost.title")}
                          </h4>

                          <div className="space-y-2">
                            <div>
                              <strong>{tProduction("batches.list.cost.rawMeat")}:</strong>{" "}
                              {rawCost ? currency(rawCost) : currency(0)}{" "}
                              <span className="text-sm text-secondary/70">
                                ({rawKg ?? 0} {tCommon("units.kg")} @{" "}
                                {batch.sourcingPhase?.pricePerKg
                                  ? currency(batch.sourcingPhase.pricePerKg)
                                  : "—"}
                                /{tCommon("units.kg")})
                              </span>
                            </div>

                            <div>
                              <strong>{tProduction("batches.list.cost.salt")}:</strong>{" "}
                              {batch.curingPhase?.saltAmountInGrams
                                ? `${
                                    batch.curingPhase.saltAmountInGrams / 1000
                                  } ${tCommon("units.kg")}`
                                : "—"}
                            </div>

                            <div>
                              <strong>{tProduction("batches.list.cost.spices")}:</strong>{" "}
                              <span className="text-sm text-secondary/70">
                                ({seasoningEntries.length} entries)
                              </span>
                              <div className="mt-2 ml-3">
                                {seasoningEntries.length === 0 && (
                                  <div className="text-secondary/60">
                                    {tProduction("batches.list.cost.noSpices")}
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
                                        {name} — {e.spiceAmountUsed ?? 0} {tCommon("units.g")}
                                      </div>
                                      <div className="text-sm">
                                        {currency(cost)}
                                      </div>
                                    </div>
                                  );
                                })}
                                {seasoningEntries.length > 0 && (
                                  <div className="mt-2 border-t pt-2">
                                    <strong>{tProduction("batches.list.cost.totalSpice")}</strong>{" "}
                                    {currency(spiceCost)}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <strong>{tProduction("batches.list.cost.paperTowel")}:</strong>{" "}
                              {currency(paperTowelCost)}
                            </div>

                            <div>
                              <strong>{tProduction("batches.list.cost.vacuumRolls")}:</strong>{" "}
                              {currency(vacuumRollCost)}
                            </div>

                            <div className="mt-3 border-t pt-2">
                              <strong>{tProduction("batches.list.cost.totalCost")}</strong>{" "}
                              {currency(computedTotal)}
                            </div>
                          </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-accent-content text-xl mb-2 text-center">
                            {tProduction("batches.list.details.title")}
                          </h4>
                          <p>
                            <strong>{tProduction("batches.list.details.rawMeat")}:</strong>{" "}
                            {(batch.sourcingPhase?.amountInGrams ?? 0) / 1000}{" "}
                            {tCommon("units.kg")}
                            <br />
                            <strong>{tProduction("batches.list.details.wasteMeat")}:</strong>{" "}
                            {(batch.preppingPhase?.wasteInGrams ?? 0) / 1000} {tCommon("units.kg")}
                            <br />
                            <strong>{tProduction("batches.list.details.meatForCooking")}</strong>{" "}
                            {(batch.preppingPhase?.cookingCutsIngrams ?? 0) /
                              1000}{" "} {tCommon("units.kg")}                            
                            <br />
                            <br />
                            {batch.curingPhase?.saltAmountInGrams &&
                            batch.sourcingPhase?.amountKg ? (
                              <>
                                <strong>{tProduction("batches.list.details.salt")}</strong>{" "}
                                {(
                                  batch.curingPhase.saltAmountInGrams /
                                  batch.sourcingPhase.amountKg
                                ).toFixed(1) || 0}{" "}
                                {tCommon("units.g")}/{tCommon("units.kg")}
                              </>
                            ) : null}
                          </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BatchList;
