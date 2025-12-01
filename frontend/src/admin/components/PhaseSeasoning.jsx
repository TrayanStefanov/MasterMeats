import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useSpiceStore } from "../stores/useSpiceStore";
import { useSpiceMixStore } from "../stores/useSpiceMixStore";
import CombinedSpiceSelector from "./CombinedSpiceSelector";
import TimeInput from "./TimeInput";

const PhaseSeasoning = ({ data, onChange }) => {
  const { spices, fetchSpices } = useSpiceStore();
  const { spiceMixes, fetchSpiceMixes } = useSpiceMixStore();
  const [errors, setErrors] = useState([]);

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
        e.spice = "Select a spice or mix";
      if (!entry.cuts || entry.cuts <= 0) e.cuts = "Enter valid cuts";
      if (!entry.spiceAmountUsedInGrams || entry.spiceAmountUsedInGrams <= 0)
        e.amount = "Enter spice amount";
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
      <h2 className="text-2xl font-bold indent-2 text-secondary">Seasoning</h2>

      {data.entries.map((entry, idx) => (
        <div key={idx} className="border-4 border-secondary p-4 rounded-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-secondary/80">
              Entry #{idx + 1}
            </h3>
            <button
              className="btn btn-error btn-sm"
              onClick={() => removeEntry(idx)}
            >
              <FaTrash />
            </button>
          </div>

          <div className="flex flex-col gap-3 mt-3">
            <input
              type="number"
              className={`input input-bordered ${
                errors[idx]?.cuts ? "input-error" : ""
              }`}
              placeholder="Number of cuts"
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

            <input
              type="number"
              className={`input input-bordered ${
                errors[idx]?.amount ? "input-error" : ""
              }`}
              placeholder="Spice used (grams)"
              value={entry.spiceAmountUsedInGrams}
              onChange={(e) =>
                updateEntry(idx, { spiceAmountUsedInGrams: e.target.value })
              }
            />
            {errors[idx]?.amount && (
              <span className="text-red-500 text-sm">{errors[idx].amount}</span>
            )}

            <input
              className="input input-bordered"
              placeholder="Rack positions (comma separated)"
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

      <button className="btn btn-accent" onClick={addEntry}>
        <FaPlus /> Add Entry
      </button>

      <label className="mt-4 font-semibold">Time taken</label>
      <TimeInput
        valueMinutes={data.workTimeMinutes || 0}
        onChange={(val) => onChange({ ...data, workTimeMinutes: val })}
      />

      <input
        type="number"
        className="input input-bordered mt-2"
        placeholder="Paper towel cost"
        value={data.paperTowelCost || ""}
        onChange={(e) => onChange({ ...data, paperTowelCost: e.target.value })}
      />
    </div>
  );
};

export default PhaseSeasoning;
