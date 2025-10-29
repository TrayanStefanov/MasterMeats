const DeliveryDetails = ({ details, setDetails }) => {
  const handleChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="border-t-4 border-accent-content/60 pt-6">
      <h3 className="text-2xl font-semibold text-secondary text-center mb-4">
        Delivery Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="date"
          value={details.dateOfDelivery?.slice(0, 10) || ""}
          onChange={(e) => handleChange("dateOfDelivery", e.target.value)}
          className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
          required
        />

        <label className="flex items-center gap-2 text-secondary">
          <input
            type="checkbox"
            checked={details.completed}
            onChange={(e) => handleChange("completed", e.target.checked)}
            className="accent-accent"
          />
          Mark as completed
        </label>

        <div className="flex flex-col">
          <label className="text-secondary text-sm mb-1">
            Calculated Total Amount (€)
          </label>
          <input
            type="number"
            value={details.calculatedTotalAmmount || 0}
            readOnly
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-secondary text-sm mb-1">
            Amount Due (€)
          </label>
          <input
            type="number"
            value={details.amountDue || 0}
            onChange={(e) => handleChange("amountDue", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
            min="0"
          />
        </div>

        <textarea
          placeholder="Reservation notes (optional)"
          value={details.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20 md:col-span-2"
          rows="3"
        />
      </div>
    </div>
  );
};


export default DeliveryDetails;
