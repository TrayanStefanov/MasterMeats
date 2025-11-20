import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const SpiceForm = ({ spice = {}, onChange, mode = "create" }) => {
  const { t: tForms } = useTranslation("admin/forms");
  const { t: tProduction } = useTranslation("admin/production");

  const [form, setForm] = useState({
    _id: spice._id || null,
    name: spice.name || "",
    costPerKg: spice.costPerKg || "",
    supplier: spice.supplier || "",
    notes: spice.notes || "",
    stockInGrams: spice.stockInGrams || 0,
    isActive: spice.isActive ?? true,
  });

  useEffect(() => {
    setForm({
      _id: spice._id || null,
      name: spice.name || "",
      costPerKg: spice.costPerKg || "",
      supplier: spice.supplier || "",
      notes: spice.notes || "",
      stockInGrams: spice.stockInGrams || 0,
      isActive: spice.isActive ?? true,
    });
  }, [spice]);

  const handleChange = (field, value) => {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);
    onChange?.(updatedForm);
  };

  return (
    <div className="border-t-4 border-accent-content/60 pt-6 px-4">
      <h3 className="text-2xl lg:text-3xl font-semibold text-secondary text-center mb-4">
        {mode === "edit"
          ? tProduction("spice.editTitle", "Edit Spice")
          : tProduction("spice.createTitle", "Create Spice")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-secondary text-sm mb-1">
            {tForms("spice.nameLabel", "Spice Name")}
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder={tForms("spice.namePlaceholder", "Enter spice name")}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-secondary text-sm mb-1">
            {tForms("spice.costPerKgLabel", "Cost per Kg (€)")}
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.costPerKg}
            onChange={(e) =>
              handleChange("costPerKg", parseFloat(e.target.value))
            }
            placeholder={tForms("spice.costPerKgPlaceholder", "0.00")}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-secondary text-sm mb-1">
            {tForms("spice.stockLabel", "Stock (Kg)")}
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.stockInGrams}
            onChange={(e) =>
              handleChange("stockInGrams", parseFloat(e.target.value))
            }
            placeholder={tForms("spice.stockPlaceholder", "0.00")}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-secondary text-sm mb-1">
            {tForms("spice.supplierLabel", "Supplier")}
          </label>
          <input
            type="text"
            value={form.supplier}
            onChange={(e) => handleChange("supplier", e.target.value)}
            placeholder={tForms("spice.supplierPlaceholder", "Optional")}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="text-secondary text-sm mb-1">
            {tForms("spice.notesLabel", "Notes")}
          </label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder={tForms("spice.notesPlaceholder", "Optional notes")}
            className="w-full p-3 rounded-md bg-secondary text-primary border border-accent/20"
          />
        </div>

        <div className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => handleChange("isActive", e.target.checked)}
            id="spice-isActive"
            className="w-5 h-5 accent-accent-content"
          />
          <label
            htmlFor="spice-isActive"
            className="text-secondary font-medium"
          >
            {tForms("spice.isActiveLabel", "Active")}
          </label>
        </div>
      </div>
    </div>
  );
};

export default SpiceForm;
