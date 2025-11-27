import { useEffect, useState } from "react";
import { useSpiceStore } from "../stores/useSpiceStore";
import { useSpiceMixStore } from "../stores/useSpiceMixStore";
import TimeInput from "./TimeInput";

const PhaseVacuumSealing = ({ data, onChange, previousPhaseEntries }) => {
  const { spices, fetchSpices, loading: spicesLoading } = useSpiceStore();
  const {
    spiceMixes,
    fetchSpiceMixes,
    loading: mixesLoading,
  } = useSpiceMixStore();

  const [initialized, setInitialized] = useState(false);

  // Fetch spices and mixes on mount
  useEffect(() => {
    fetchSpices();
    fetchSpiceMixes();
  }, []);

  // Initialize vacuum entries from seasoning phase
  useEffect(() => {
    if (!initialized && previousPhaseEntries?.length && !data.entries.length) {
      const mappedEntries = previousPhaseEntries.map((e) => {
        const spice = spices.find((s) => s._id === e.spiceId);
        const mix = spiceMixes.find((m) => m._id === e.spiceMixId);

        return {
          spiceName: spice ? spice.name : mix ? mix.name : "Unknown Spice",
          originalSlices: Number(e.cuts) || 0,
          rackPositions: Array.isArray(e.rackPositions) ? e.rackPositions : [],
          vacuumedSlices: "",
          driedKg: "",
        };
      });

      onChange({ ...data, entries: mappedEntries });
      setInitialized(true);
    }
  }, [previousPhaseEntries, spices, spiceMixes, data.entries, initialized]);

  // Helper to update individual entries
  const updateEntry = (idx, field, value) => {
    const newEntries = [...data.entries];
    newEntries[idx] = { ...newEntries[idx], [field]: value };
    onChange({ ...data, entries: newEntries });
  };

  const updateField = (field, value) => onChange({ ...data, [field]: value });

  if (spicesLoading || mixesLoading) return <p>Loading spices...</p>;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">Vacuum Sealing</h2>

      {data.entries.map((entry, idx) => (
        <div key={idx} className="bg-base-300 p-4 rounded-xl">
          <h3 className="font-semibold mb-2">Entry #{idx + 1}</h3>

          <div className="flex flex-col gap-2">
            <div>
              <strong>Spice name:</strong> {entry.spiceName}
            </div>
            <div>
              <strong># of slices (seasoning):</strong> {entry.originalSlices}
            </div>
            <div>
              <strong>Rack positions:</strong>{" "}
              {entry.rackPositions.join(", ") || "N/A"}
            </div>

            <label className="mt-4 font-semibold">Time taken</label>
            <TimeInput
              valueMinutes={entry.timeDriedMinutes || 0}
              onChange={(val) => updateEntry(idx, "timeDriedMinutes", val)}
            />

            <input
              type="number"
              className="input input-bordered"
              placeholder="# of vacuumed slices"
              value={entry.vacuumedSlices}
              onChange={(e) =>
                updateEntry(idx, "vacuumedSlices", Number(e.target.value))
              }
            />

            <input
              type="number"
              className="input input-bordered"
              placeholder="Total dried KG"
              value={entry.driedKg}
              onChange={(e) =>
                updateEntry(idx, "driedKg", Number(e.target.value))
              }
            />
          </div>
        </div>
      ))}

      <label className="mt-4 font-semibold">Time taken</label>
      <TimeInput
        valueMinutes={data.workTimeMinutes || 0}
        onChange={(val) => updateField("workTimeMinutes", val)}
      />

      <input
        type="number"
        className="input input-bordered"
        placeholder="Vacuum roll cost"
        value={data.vacuumRollCost}
        onChange={(e) => updateField("vacuumRollCost", Number(e.target.value))}
      />
    </div>
  );
};

export default PhaseVacuumSealing;
