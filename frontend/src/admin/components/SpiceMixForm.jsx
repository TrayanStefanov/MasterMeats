import { useState, useEffect, useRef} from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useProductionStore } from "../stores/useProductionStore";

const ADJUST_STEPS = [-50, -25, -10, -5, -2, -1, 0, 1, 2, 5, 10, 25, 50];

const SpiceMixForm = ({ mix, onChange }) => {
  const { spices = [] } = useProductionStore();
  const [localMix, setLocalMix] = useState(mix);
  const wrapperRef = useRef(null);

  useEffect(() => setLocalMix(mix), [mix]);

  const handleFieldChange = (key, value) => {
    setLocalMix((prev) => {
      const updated = { ...prev, [key]: value };
      onChange(updated);
      return updated;
    });
  };

  useEffect(() => {
    let totalCost = 0;
    let totalGrams = 0;

    (localMix.ingredients || []).forEach((ing) => {
      const spice = spices.find((s) => s._id === ing.spice);
      if (!spice) return;

      const costPerGram = spice.costPerKg / 1000;
      const grams = ing.grams || 0;

      totalCost += grams * costPerGram;
      totalGrams += grams;
    });

    const costPer100g = totalGrams
      ? Number(((totalCost / totalGrams) * 100).toFixed(2))
      : 0;

    setLocalMix((prev) => ({ ...prev, costPer100g }));
  }, [localMix.ingredients, spices]);


  return (
    <div className="space-y-6" ref={wrapperRef}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="mb-1 text-sm lg:text-lg text-secondary">Name</label>
          <input
            type="text"
            value={localMix.name || ""}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            className="bg-secondary text-primary border border-accent/30 rounded-md px-3 py-2 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm lg:text-lg text-secondary">
            Notes
          </label>
          <textarea
            value={localMix.notes || ""}
            onChange={(e) => handleFieldChange("notes", e.target.value)}
            className="bg-secondary text-primary border border-accent/30 rounded-md px-3 py-2 outline-none"
          />
        </div>

      </div>


      <style>
        {`
          .no-spinner::-webkit-outer-spin-button,
          .no-spinner::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .no-spinner[type=number] {
            -moz-appearance: textfield;
          }
        `}
      </style>
    </div>
  );
};

export default SpiceMixForm;
