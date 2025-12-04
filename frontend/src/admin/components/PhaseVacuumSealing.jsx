import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSpiceStore } from "../stores/useSpiceStore";
import { useSpiceMixStore } from "../stores/useSpiceMixStore";
import { useProductStore } from "../../stores/useProductStore";
import TimeInput from "./TimeInput";

const PhaseVacuumSealing = ({ data, onChange, previousPhaseEntries }) => {
  const { spices, fetchSpices } = useSpiceStore();
  const { spiceMixes, fetchSpiceMixes } = useSpiceMixStore();
  const { products, fetchAdminProducts } = useProductStore();

  const { t: tBatches } = useTranslation("admin/batches");

  const [initialized, setInitialized] = useState(false);

  /* ------------ LOAD ALL DATA ------------ */
  useEffect(() => {
    fetchSpices();
    fetchSpiceMixes();
    fetchAdminProducts();
  }, []);

  /* ------------ INITIALIZE VACUUM ENTRIES ------------ */
  useEffect(() => {
  if (initialized) return;
  if (!previousPhaseEntries?.length) return;
  if (data.entries.length) return;
  if (!spices.length && !spiceMixes.length) return;

  const mapped = previousPhaseEntries.map((e) => {
    const spice = spices.find((s) => s._id === e.spiceId);
    const mix = spiceMixes.find((m) => m._id === e.spiceMixId);

    const product = products.find(
      (p) =>
        p.defaultSpiceId === e.spiceId ||
        p.defaultSpiceMixId === e.spiceMixId
    );

    return {
      spiceId: e.spiceId ?? null,
      spiceMixId: e.spiceMixId ?? null,
      spiceName: spice ? spice.name : mix ? mix.name : "Unknown Spice",
      productName: product?.name || "Unknown Product",
      originalSlices: Number(e.cuts) || 0,
      rackPositions: e.rackPositions || [],
      vacuumedSlices: "",
      driedInGrams: "",
      timeDriedMinutes: 0,
    };
  });

  onChange({ ...data, entries: mapped });
  setInitialized(true);
}, [previousPhaseEntries, spices, spiceMixes, products, initialized]);

  /* ------------ HELPERS ------------ */
  const updateEntry = (idx, field, value) => {
    const newEntries = [...data.entries];
    newEntries[idx] = { ...newEntries[idx], [field]: value };
    onChange({ ...data, entries: newEntries });
  };

  const updateField = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">{tBatches("vacuumSealing.title")}</h2>

      {data.entries.map((entry, idx) => (
        <div key={idx} className="bg-base-300 p-4 rounded-xl">
          <h3 className="font-semibold mb-2">{tBatches("vacuumSealing.entry")}{idx + 1}</h3>

          <div className="flex flex-col gap-2">
            <div>
              <strong>{tBatches("vacuumSealing.productName")}</strong> {entry.productName}
            </div>
            <div>
              <strong>{tBatches("vacuumSealing.spiceName")}</strong> {entry.spiceName}
            </div>
            <div>
              <strong>{tBatches("vacuumSealing.seasonedSlices")}</strong> {entry.originalSlices}
            </div>
            <div>
              <strong>{tBatches("vacuumSealing.rackPositions")}</strong>{" "}
              {entry.rackPositions.join(", ") || "None"}
            </div>

            <label className="mt-4 font-semibold">{tBatches("vacuumSealing.dryingTime")}</label>
            <TimeInput
              valueMinutes={entry.timeDriedMinutes}
              onChange={(val) => updateEntry(idx, "timeDriedMinutes", val)}
            />

            <label>{tBatches("vacuumSealing.vacuumedSlices")}</label>
            <input
              type="number"
              className="input input-bordered"
              placeholder="1,2,3..."
              value={entry.vacuumedSlices}
              onChange={(e) =>
                updateEntry(idx, "vacuumedSlices", Number(e.target.value))
              }
            />

            <label>{tBatches("vacuumSealing.driedWeight")}</label>
            <input
              type="number"
              className="input input-bordered"
              placeholder="0"
              value={entry.driedInGrams}
              onChange={(e) =>
                updateEntry(idx, "driedInGrams", Number(e.target.value))
              }
            />
          </div>
        </div>
      ))}


      <label className="mt-4 font-semibold">{tBatches("vacuumSealing.timeTaken")}</label>
      <TimeInput
        valueMinutes={data.workTimeMinutes || 0}
        onChange={(val) => updateField("workTimeMinutes", val)}
      />

      <label>{tBatches("vacuumSealing.vacuumRollCost")}</label>
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
