import React from "react";
import { useTranslation } from "react-i18next";

import TimeInput from "./TimeInput";

const meatTypes = ["Pork", "Chicken", "Veal"];
const cutTypes = ["Loin", "Neck", "Leg", "Tenderloin"];

const PhaseSourcing = ({ data, onChange }) => {

  const {t: tBatches} = useTranslation("admin/batches");
  const update = (field, value) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold indent-2 text-secondary">{tBatches("sourcing.title")}</h2>

      {/* Meat Type Dropdown */}
      <select
        className="select select-bordered w-full bg-secondary"
        value={data.meatType || ""}
        onChange={(e) => update("meatType", e.target.value)}
      >
        <option value="" disabled>
          {tBatches("sourcing.meatType")}
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
          {tBatches("sourcing.meatCutType")}
        </option>
        {cutTypes.map((cut) => (
          <option key={cut} value={cut}>
            {cut}
          </option>
        ))}
      </select>

      {/* Supplier */}
      <label>{tBatches("sourcing.supplier")}</label>
      <input
        className="input input-bordered"
        placeholder={tBatches("sourcing.supplierPlaceholder")}
        value={data.supplier || ""}
        onChange={(e) => update("supplier", e.target.value)}
      />

      {/* Amount in Kg */}
      <label>{tBatches("sourcing.amountInKg")}</label>
      <input
        type="number"
        className="input input-bordered"
        placeholder="0.00"
        value={data.amountInGrams || ""}
        onChange={(e) => update("amountInGrams", e.target.value)}
      />

      {/* Price per Kg */}
      <label>{tBatches("sourcing.pricePerKg")}</label>
      <input
        type="number"
        className="input input-bordered"
        placeholder="0.00€"
        value={data.pricePerKg || ""}
        onChange={(e) => update("pricePerKg", e.target.value)}
      />

      {/* Time Taken (minutes*/}
      <label>{tBatches("sourcing.timeTaken")}</label>
      <TimeInput
        valueMinutes={data.workTimeMinutes || 0}
        onChange={(val) => update("workTimeMinutes", val)}
      />
    </div>
  );
};

export default PhaseSourcing;
