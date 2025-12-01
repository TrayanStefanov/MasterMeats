import React from "react";
import TimeInput from "./TimeInput";

const meatTypes = ["Pork", "Chicken", "Veal"];
const cutTypes = ["Loin", "Neck", "Leg", "Tenderloin"];

const PhaseSourcing = ({ data, onChange }) => {
  const update = (field, value) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold indent-2 text-secondary">Sourcing</h2>

      {/* Meat Type Dropdown */}
      <select
        className="select select-bordered w-full bg-secondary"
        value={data.meatType || ""}
        onChange={(e) => update("meatType", e.target.value)}
      >
        <option value="" disabled>
          Select Meat Type
        </option>
        {meatTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {/* Cut Type Dropdown */}
      <select
        className="select select-bordered w-full bg-secondary"
        value={data.meatCutType || ""}
        onChange={(e) => update("meatCutType", e.target.value)}
      >
        <option value="" disabled>
          Select Cut Type
        </option>
        {cutTypes.map((cut) => (
          <option key={cut} value={cut}>
            {cut}
          </option>
        ))}
      </select>

      {/* Supplier */}
      <input
        className="input input-bordered"
        placeholder="Supplier"
        value={data.supplier || ""}
        onChange={(e) => update("supplier", e.target.value)}
      />

      {/* Amount in Kg */}
      <input
        type="number"
        className="input input-bordered"
        placeholder="Amount in Kg"
        value={data.amountInGrams || ""}
        onChange={(e) => update("amountInGrams", e.target.value)}
      />

      {/* Price per Kg */}
      <input
        type="number"
        className="input input-bordered"
        placeholder="Price per Kg"
        value={data.pricePerKg || ""}
        onChange={(e) => update("pricePerKg", e.target.value)}
      />

      {/* Time Taken (minutes*/}
      <label>Time Taken (minutes)</label>
      <TimeInput
        valueMinutes={data.workTimeMinutes || 0}
        onChange={(val) => update("workTimeMinutes", val)}
      />
    </div>
  );
};

export default PhaseSourcing;
