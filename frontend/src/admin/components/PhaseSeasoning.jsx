import { useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useSpiceStore } from "../stores/useSpiceStore";
import { useSpiceMixStore } from "../stores/useSpiceMixStore";

const PhaseSeasoning = ({ data, onChange }) => {
  const update = (field, value) => onChange({ ...data, [field]: value });

  const updateEntry = (idx, field, value) => {
    const newEntries = [...data.entries];
    newEntries[idx] = { ...newEntries[idx], [field]: value };
    onChange({ ...data, entries: newEntries });
  };

  const addEntry = () => {
    onChange({
      ...data,
      entries: [
        ...data.entries,
        {
          cuts: "",
          spiceId: "",
          spiceMixId: "",
          spiceAmountUsed: 0,
          rackPositions: [],
        },
      ],
    });
  };

  const removeEntry = (idx) => {
    const newEntries = data.entries.filter((_, i) => i !== idx);
    onChange({ ...data, entries: newEntries });
  };

  const { spices, fetchSpices } = useSpiceStore();
  const { spiceMixes, fetchSpiceMixes } = useSpiceMixStore();

  useEffect(() => {
    fetchSpices();
    fetchSpiceMixes();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">Seasoning</h2>

      {data.entries.map((entry, idx) => (
        <div key={idx} className="bg-base-300 p-4 rounded-xl">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Entry #{idx + 1}</h3>
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
              className="input input-bordered"
              placeholder="Number of cuts"
              value={entry.cuts}
              onChange={(e) => updateEntry(idx, "cuts", e.target.value)}
            />

            <select
              className="select select-bordered w-full"
              value={entry.spiceId || ""}
              onChange={(e) => updateEntry(idx, "spiceId", e.target.value)}
              disabled={!!entry.spiceMixId} // disable if a mix is selected
            >
              <option value="">Select Spice (optional if using mix)</option>
              {spices.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.stockInGrams} g)
                </option>
              ))}
            </select>

            <select
              className="select select-bordered w-full"
              value={entry.spiceMixId || ""}
              onChange={(e) => {
                const val = e.target.value;
                updateEntry(idx, "spiceMixId", val);
                if (val) updateEntry(idx, "spiceId", ""); // clear spice if mix selected
              }}
              disabled={!!entry.spiceId} // disable if a single spice is selected
            >
              <option value="">
                Select Spice Mix (optional if using single spice)
              </option>
              {spiceMixes.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.stockInGrams} g)
                </option>
              ))}
            </select>

            <input
              type="number"
              className="input input-bordered"
              placeholder="Spice used (grams)"
              value={entry.spiceAmountUsed}
              onChange={(e) =>
                updateEntry(idx, "spiceAmountUsed", e.target.value)
              }
            />

            <input
              className="input input-bordered"
              placeholder="Rack positions (comma separated)"
              value={entry.rackPositions.join(", ")}
              onChange={(e) =>
                updateEntry(
                  idx,
                  "rackPositions",
                  e.target.value.split(",").map((v) => v.trim())
                )
              }
            />
          </div>
        </div>
      ))}

      <button className="btn btn-accent" onClick={addEntry}>
        <FaPlus /> Add Entry
      </button>

      <input
        type="number"
        className="input input-bordered"
        placeholder="Time taken (minutes)"
        value={data.timeTaken}
        onChange={(e) => update("timeTaken", e.target.value)}
      />

      <input
        type="number"
        className="input input-bordered"
        placeholder="Paper towel cost"
        value={data.paperTowelCost || ""}
        onChange={(e) => update("paperTowelCost", e.target.value)}
      />
    </div>
  );
};

export default PhaseSeasoning;
