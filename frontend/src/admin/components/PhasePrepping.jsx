import TimeInput from "./TimeInput";

const PhasePrepping = ({ data, onChange }) => {
  const update = (field, value) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold indent-2 text-secondary">Prepping</h2>

      {/* Waste KG */}
      <input
        type="number"
        className="input input-bordered"
        placeholder="Waste cuts (trash) in KG"
        value={data.wasteKg}
        onChange={(e) => update("wasteKg", e.target.value)}
      />

      {/* Cooking Cuts KG */}
      <input
        type="number"
        className="input input-bordered"
        placeholder="Cooking cuts (imperfect fillets) in KG"
        value={data.cookingCutsKg}
        onChange={(e) => update("cookingCutsKg", e.target.value)}
      />

      {/* Time Taken */}
      <label>Time taken</label>
      <TimeInput
        valueMinutes={data.workTimeMinutes || 0}
        onChange={(val) => update("workTimeMinutes", val)}
      />
    </div>
  );
};

export default PhasePrepping;
