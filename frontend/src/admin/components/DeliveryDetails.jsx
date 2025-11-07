import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const DeliveryDetails = ({ details, setDetails }) => {
  const { t: tForms } = useTranslation("admin/forms");

  const handleChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!details.dateOfDelivery) {
      const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
      setDetails((prev) => ({ ...prev, dateOfDelivery: today }));
    }
  }, [details.dateOfDelivery, setDetails]);

  return (
    <div className="border-t-4 border-accent-content/60 pt-6">
      <h3 className="text-2xl font-semibold text-secondary text-center mb-4">
        {tForms("delivery.title")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-secondary text-sm mb-1">
            {tForms("delivery.dateOfDelivery")}
          </label>
          <input
            type="date"
            value={details.dateOfDelivery?.slice(0, 10) || ""}
            onChange={(e) => handleChange("dateOfDelivery", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-secondary text-sm mb-1">
            {tForms("delivery.amountDue")} (€)
          </label>
          <input
            type="number"
            value={details.amountDue || 0}
            onChange={(e) => handleChange("amountDue", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
            min="0"
          />
        </div>

        <div className="flex items-center gap-2 mt-7">
          <input
            type="checkbox"
            checked={details.delivered || false}
            onChange={(e) => handleChange("delivered", e.target.checked)}
            className="accent-accent h-5 w-5"
          />
          <label className="text-secondary">
            {tForms("delivery.delivered")}
          </label>
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="text-secondary text-sm mb-1">
            {tForms("delivery.notesLabel")}
          </label>
          <textarea
            placeholder={tForms("delivery.notesPlaceholder")}
            value={details.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
            rows="3"
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;
