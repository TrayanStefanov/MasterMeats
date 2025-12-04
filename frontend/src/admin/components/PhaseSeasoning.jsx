import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import { useSpiceStore } from "../stores/useSpiceStore";
import { useSpiceMixStore } from "../stores/useSpiceMixStore";
import CombinedSpiceSelector from "./CombinedSpiceSelector";
import TimeInput from "./TimeInput";

const PhaseSeasoning = ({ data, onChange }) => {
  const { spices, fetchSpices } = useSpiceStore();
  const { spiceMixes, fetchSpiceMixes } = useSpiceMixStore();
  const [errors, setErrors] = useState([]);

  const {t: tCommon} = useTranslation('admin/common');
  const {t: tBatches} = useTranslation('admin/batches');

  useEffect(() => {
    fetchSpices();
    fetchSpiceMixes();
  }, []);

  const updateEntry = (idx, newFields) => {
    const entries = [...data.entries];
    entries[idx] = { ...entries[idx], ...newFields };
    console.log(`[updateEntry] Before onChange, idx=${idx}:`, entries[idx]);
    onChange({ ...data, entries });
  };

  const addEntry = () => {
    const newEntry = {
      cuts: "",
      spiceId: null,
      spiceMixId: null,
      spiceAmountUsedInGrams: "",
      rackPositions: [],
    };
    const updatedEntries = [...data.entries, newEntry];
    console.log("[addEntry] Adding entry:", newEntry);
    onChange({ ...data, entries: updatedEntries });
  };

  const removeEntry = (idx) => {
    const updatedEntries = data.entries.filter((_, i) => i !== idx);
    console.log(
      `[removeEntry] Removing index ${idx}, new entries:`,
      updatedEntries
    );
    onChange({ ...data, entries: updatedEntries });
  };

  const validateEntries = () => {
    const errs = data.entries.map((entry, i) => {
      const e = {};
      if (!entry.spiceId && !entry.spiceMixId)
        e.spice = tBatches("seasoning.validation.selectSpice");
      if (!entry.cuts || entry.cuts <= 0) e.cuts = tBatches("seasoning.validation.validCuts");
      if (!entry.spiceAmountUsedInGrams || entry.spiceAmountUsedInGrams <= 0)
        e.amount = tBatches("seasoning.validation.spiceAmount");
      return Object.keys(e).length ? e : null;
    });

    setErrors(errs);

    console.log("[validateEntries] Errors:", errs);
    console.log("[validateEntries] Entries being validated:", data.entries);

    return errs.some(Boolean);
  };

  // Watch for changes in entries
  useEffect(() => {
    console.log("[useEffect] data.entries changed:", data.entries);
    validateEntries();
  }, [data.entries]);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold indent-2 text-secondary">{tBatches("seasoning.title")}</h2>

      {data.entries.map((entry, idx) => (
        <div key={idx} className="border-4 border-secondary p-4 rounded-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-secondary/80">
              {tBatches("seasoning.entry")}{idx + 1}
            </h3>
            <button
              className="btn btn-error btn-sm"
              onClick={() => removeEntry(idx)}
              title={tCommon("buttons.deleteEntry")}
            >
              <FaTrash />
            </button>
          </div>

          <div className="flex flex-col gap-3 mt-3">
            <label>{tBatches("seasoning.numberOfCuts")}</label>
            <input
              type="number"
              className={`input input-bordered ${
                errors[idx]?.cuts ? "input-error" : ""
              }`}
              placeholder="0"
              value={entry.cuts}
              onChange={(e) => updateEntry(idx, { cuts: e.target.value })}
            />
            {errors[idx]?.cuts && (
              <span className="text-red-500 text-sm">{errors[idx].cuts}</span>
            )}

            <CombinedSpiceSelector
              spices={spices}
              mixes={spiceMixes}
              value={
                entry.spiceId || entry.spiceMixId
                  ? {
                      id: entry.spiceId || entry.spiceMixId,
                      type: entry.spiceId ? "spice" : "mix",
                    }
                  : null
              }
              onChange={(val) =>
                updateEntry(idx, {
                  spiceId: val?.type === "spice" && val.id ? val.id : null,
                  spiceMixId: val?.type === "mix" && val.id ? val.id : null,
                })
              }
            />
            {errors[idx]?.spice && (
              <span className="text-red-500 text-sm">{errors[idx].spice}</span>
            )}

            <label>{tBatches("seasoning.spiceAmountUsed")}</label>
            <input
              type="number"
              className={`input input-bordered ${
                errors[idx]?.amount ? "input-error" : ""
              }`}
              placeholder="0"
              value={entry.spiceAmountUsedInGrams}
              onChange={(e) =>
                updateEntry(idx, { spiceAmountUsedInGrams: e.target.value })
              }
            />
            {errors[idx]?.amount && (
              <span className="text-red-500 text-sm">{errors[idx].amount}</span>
            )}

            <label>{tBatches("seasoning.rackPositions")}</label>
            <input
              className="input input-bordered"
              placeholder={tBatches("seasoning.rackPositionsPlaceholder")}
              value={entry.rackPositions.join(", ")}
              onChange={(e) =>
                updateEntry(idx, {
                  rackPositions: e.target.value.split(",").map((v) => v.trim()),
                })
              }
            />
          </div>
        </div>
      ))}

      <button className="btn btn-accent" onClick={addEntry} title={tCommon("buttons.addEntry")}>
        <FaPlus /> {tCommon("buttons.addEntry")}
      </button>

      <label className="mt-4 font-semibold">{tBatches("seasoning.timeTaken")}</label>
      <TimeInput
        valueMinutes={data.workTimeMinutes || 0}
        onChange={(val) => onChange({ ...data, workTimeMinutes: val })}
      />

      <label>{tBatches("seasoning.paperTowelCost")}</label>
      <input
        type="number"
        className="input input-bordered mt-2"
        placeholder="0.00 €"
        value={data.paperTowelCost || ""}
        onChange={(e) => onChange({ ...data, paperTowelCost: e.target.value })}
      />
    </div>
  );
};

export default PhaseSeasoning;
