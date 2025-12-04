import TimeInput from "./TimeInput";
import { useTranslation } from "react-i18next";

const PhasePrepping = ({ data, onChange }) => {

  const {t: tBatches} = useTranslation("admin/batches");
  const update = (field, value) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold indent-2 text-secondary">{tBatches("prepping.title")}</h2>

      {/* Waste KG */}
      <label>{tBatches("prepping.wasteCuts")}</label>
      <input
        type="number"
        className="input input-bordered"
        placeholder="0.00"
        value={data.wasteInGrams}
        onChange={(e) => update("wasteInGrams", e.target.value)}
      />

      {/* Cooking Cuts KG */}
      <label>{tBatches("prepping.cookingCuts")}</label>
      <input
        type="number"
        className="input input-bordered"
        placeholder="0"
        value={data.cookingCutsInGrams}
        onChange={(e) => update("cookingCutsInGrams", e.target.value)}
      />

      {/* Time Taken */}
      <label>{tBatches("prepping.timeTaken")}</label>
      <TimeInput
        valueMinutes={data.workTimeMinutes || 0}
        onChange={(val) => update("workTimeMinutes", val)}
      />
    </div>
  );
};

export default PhasePrepping;
