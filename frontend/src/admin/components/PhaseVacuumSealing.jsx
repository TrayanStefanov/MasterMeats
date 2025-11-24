import { FaPlus, FaTrash } from "react-icons/fa";

const PhaseVacuumSealing = ({ data, onChange }) => {
  const update = (field, value) =>
    onChange({ ...data, [field]: value });

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
        { cutsCount: "", spiceId: "", driedKg: "" },
      ],
    });
  };

  const removeEntry = (idx) => {
    const newEntries = data.entries.filter((_, i) => i !== idx);
    onChange({ ...data, entries: newEntries });
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">Vacuum Sealing</h2>

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
              value={entry.cutsCount}
              onChange={(e) => updateEntry(idx, "cutsCount", e.target.value)}
            />

            <input
              className="input input-bordered"
              placeholder="Spice ID"
              value={entry.spiceId}
              onChange={(e) => updateEntry(idx, "spiceId", e.target.value)}
            />

            <input
              type="number"
              className="input input-bordered"
              placeholder="Dried KG"
              value={entry.driedKg}
              onChange={(e) => updateEntry(idx, "driedKg", e.target.value)}
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
        placeholder="Vacuum roll cost"
        value={data.rollCost}
        onChange={(e) => update("rollCost", e.target.value)}
      />
    </div>
  );
};

export default PhaseVacuumSealing;
