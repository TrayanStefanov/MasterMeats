import TimeInput from "./TimeInput";
const PhaseCuring = ({ data, onChange }) => {
  const update = (field, value) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold indent-2 text-secondary">Curing</h2>

      <input
        className="input input-bordered"
        placeholder="Salt name"
        value={data.saltName}
        onChange={(e) => update("saltName", e.target.value)}
      />

      <input
        type="number"
        className="input input-bordered"
        placeholder="Amount of salt (KG)"
        value={data.saltAmountInGrams}
        onChange={(e) => update("saltAmountInGrams", e.target.value)}
      />

      <input
        type="number"
        className="input input-bordered"
        placeholder="Cost of salt (KG)"
        value={data.saltCostPerKg}
        onChange={(e) => update("saltCostPerKg", e.target.value)}
      />

      <label>Time in salt:</label>
      <TimeInput
        valueMinutes={data.timeInSaltMinutes}
        onChange={(mins) => update("timeInSaltMinutes", mins)}
      />

      <input
        className="input input-bordered"
        placeholder="Type of liquid (water, wine, mix...)"
        value={data.liquidType}
        onChange={(e) => update("liquidType", e.target.value)}
      />

      <label>Time in liquid:</label>
      <TimeInput
        valueMinutes={data.timeInLiquidMinutes}
        onChange={(mins) => update("timeInLiquidMinutes", mins)}
      />

      <label>Rinse time taken:</label>
      <TimeInput
        valueMinutes={data.workTimeMinutes}
        onChange={(mins) => update("workTimeMinutes", mins)}
      />
    </div>
  );
};

export default PhaseCuring;
