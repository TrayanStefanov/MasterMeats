import TimeInput from "./TimeInput";
import { useTranslation } from "react-i18next";

const PhaseCuring = ({ data, onChange }) => {

  const { t: tBatches } = useTranslation("admin/batches");
  const update = (field, value) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold indent-2 text-secondary">{tBatches("curing.title")}</h2>

      <label>{tBatches("curing.saltName")}</label>
      <input
        className="input input-bordered"
        placeholder={tBatches("curing.saltNamePlaceholder")}
        value={data.saltName}
        onChange={(e) => update("saltName", e.target.value)}
      />
      <label>{tBatches("curing.saltAmount")}</label>
      <input
        type="number"
        className="input input-bordered"
        placeholder="0"
        value={data.saltAmountInGrams}
        onChange={(e) => update("saltAmountInGrams", e.target.value)}
      />

      <label>{tBatches("curing.saltCost")}</label>
      <input
        type="number"
        className="input input-bordered"
        placeholder="0.00€"
        value={data.saltCostPerKg}
        onChange={(e) => update("saltCostPerKg", e.target.value)}
      />

      <label>{tBatches("curing.saltTime")}:</label>
      <TimeInput
        valueMinutes={data.timeInSaltMinutes}
        onChange={(mins) => update("timeInSaltMinutes", mins)}
      />

      <label>{tBatches("curing.liquidName")}</label>
      <input
        className="input input-bordered"
        placeholder={tBatches("curing.liquidNamePlaceholder")}
        value={data.liquidType}
        onChange={(e) => update("liquidType", e.target.value)}
      />

      <label>{tBatches("curing.liquidTime")}</label>
      <TimeInput
        valueMinutes={data.timeInLiquidMinutes}
        onChange={(mins) => update("timeInLiquidMinutes", mins)}
      />

      <label>{tBatches("curing.timeTaken")}</label>
      <TimeInput
        valueMinutes={data.workTimeMinutes}
        onChange={(mins) => update("workTimeMinutes", mins)}
      />
    </div>
  );
};

export default PhaseCuring;
