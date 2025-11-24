const PhasePrepping = ({ data, onChange }) => {
  const update = (field, value) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Prepping</h2>

      {/* Type of meat cut */}
      <input
        className="input input-bordered"
        placeholder="Type of meat cut"
        value={data.meatType}
        onChange={(e) => update("meatType", e.target.value)}
      />

      {/* Raw KG */}
      <input
        type="number"
        className="input input-bordered"
        placeholder="Raw KG"
        value={data.rawKg}
        onChange={(e) => update("rawKg", e.target.value)}
      />

      {/* Waste cuts (trash) in KG */}
      <input
        type="number"
        className="input input-bordered"
        placeholder="Waste cuts (trash) in KG"
        value={data.wasteKg}
        onChange={(e) => update("wasteKg", e.target.value)}
      />

      {/* Cooking cuts (imperfect fillets) KG */}
      <input
        type="number"
        className="input input-bordered"
        placeholder="Cooking cuts (imperfect fillets) KG"
        value={data.cookingCutsKg}
        onChange={(e) => update("cookingCutsKg", e.target.value)}
      />

      {/* Time taken (minutes) */}
      <input
        type="number"
        className="input input-bordered"
        placeholder="Time taken (minutes)"
        value={data.timeTaken}
        onChange={(e) => update("timeTaken", e.target.value)}
      />
    </div>
  );
};

export default PhasePrepping;
