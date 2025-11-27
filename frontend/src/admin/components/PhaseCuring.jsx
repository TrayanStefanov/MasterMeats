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
        value={data.saltAmountKg}
        onChange={(e) => update("saltAmountKg", e.target.value)}
      />

      <input
        type="number"
        className="input input-bordered"
        placeholder="Cost of salt (KG)"
        value={data.saltCostPerKg}
        onChange={(e) => update("saltCostPerKg", e.target.value)}
      />

      <input
        type="number"
        className="input input-bordered"
        placeholder="Time in salt (hours)"
        value={data.timeInSaltHours}
        onChange={(e) => update("timeInSaltHours", e.target.value)}
      />

      <input
        className="input input-bordered"
        placeholder="Type of liquid (water, wine, mix...)"
        value={data.liquidType}
        onChange={(e) => update("liquidType", e.target.value)}
      />

      <input
        type="number"
        className="input input-bordered"
        placeholder="Time in liquid (hours)"
        value={data.timeInLiquidHours}
        onChange={(e) => update("timeInLiquidHours", e.target.value)}
      />

      <input
        type="number"
        className="input input-bordered"
        placeholder="Rinse time (minutes)"
        value={data.rinseTime}
        onChange={(e) => update("rinseTime", e.target.value)}
      />

      <input
        type="number"
        className="input input-bordered"
        placeholder="Total time taken (minutes)"
        value={data.timeTaken}
        onChange={(e) => update("timeTaken", e.target.value)}
      />
    </div>
  );
};

export default PhaseCuring;
