import { useState, useEffect, useRef, useMemo } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

import { useSpiceStore } from "../stores/useSpiceStore";
import { useSpiceMixStore } from "../stores/useSpiceMixStore";

const ADJUST_STEPS = [-50, -25, -10, -5, -2, -1, 0, 1, 2, 5, 10, 25, 50];

const SpiceMixForm = ({ mix, onChange }) => {
  const { availableTags } = useSpiceMixStore();
  const { spices, fetchSpices } = useSpiceStore();

  useEffect(() => {
    fetchSpices(); // Load all active spices
  }, []);
  const [localMix, setLocalMix] = useState(mix);
  const [tagInput, setTagInput] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => setLocalMix(mix), [mix]);

  const getAvailableForSpice = (spiceId) => {
    const spice = spices.find((s) => s._id === spiceId);
    return spice?.stockInGrams ?? Infinity;
  };

  const handleFieldChange = (key, value) => {
    setLocalMix((prev) => {
      const updated = { ...prev, [key]: value };
      onChange(updated);
      return updated;
    });
  };

  const totalGrams = useMemo(
    () =>
      (localMix.ingredients || []).reduce(
        (sum, ing) => sum + (ing.grams || 0),
        0
      ),
    [localMix.ingredients]
  );

  const costPer100g = useMemo(() => {
    let totalCost = 0;
    (localMix.ingredients || []).forEach((ing) => {
      const spice = spices.find((s) => s._id === ing.spice);
      if (!spice) return;
      totalCost += (ing.grams || 0) * (spice.costPerKg / 1000);
    });
    return totalGrams ? Number(((totalCost / totalGrams) * 100).toFixed(2)) : 0;
  }, [localMix.ingredients, spices, totalGrams]);

  const addIngredient = () => {
    handleFieldChange("ingredients", [
      ...(localMix.ingredients || []),
      { spice: "", grams: 0 },
    ]);
  };

  const removeIngredient = (index) => {
    handleFieldChange(
      "ingredients",
      (localMix.ingredients || []).filter((_, i) => i !== index)
    );
  };

  const updateIngredient = (index, key, value) => {
    const updated = (localMix.ingredients || []).map((ing, i) => {
      if (i !== index) return ing;
      if (key === "grams") {
        const numeric = parseFloat(value) || 0;
        const available = getAvailableForSpice(ing.spice);
        return { ...ing, grams: Math.min(numeric, available) };
      }
      return { ...ing, [key]: value };
    });
    handleFieldChange("ingredients", updated);
  };

  const adjustValue = (index, amount) => {
    const updated = (localMix.ingredients || []).map((ing, i) => {
      if (i !== index) return ing;
      const available = getAvailableForSpice(ing.spice);
      const newVal = amount === 0 ? 0 : ing.grams + amount;
      return { ...ing, grams: Math.max(0, Math.min(newVal, available)) };
    });
    handleFieldChange("ingredients", updated);
  };

  const validate = () =>
    (localMix.ingredients || []).every((i) => i.spice && i.grams > 0);

  const filteredSuggestions = useMemo(() => {
    if (!tagInput) return [];
    return (availableTags || [])
      .filter(
        (t) =>
          t.toLowerCase().startsWith(tagInput.toLowerCase()) &&
          !(localMix.tags || []).includes(t)
      )
      .slice(0, 6);
  }, [tagInput, availableTags, localMix.tags]);

  const handleAddTag = (e, tagOverride = null) => {
    e?.preventDefault?.();
    const tag = (tagOverride || tagInput).trim();
    if (!tag) return;
    if (!(localMix.tags || []).includes(tag)) {
      handleFieldChange("tags", [...(localMix.tags || []), tag]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    handleFieldChange(
      "tags",
      (localMix.tags || []).filter((t) => t !== tagToRemove)
    );
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setTagInput("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-6" ref={wrapperRef}>
      {/* Name, Notes, Tags */}
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

        {/* Tags */}
        <div className="flex flex-col md:col-span-2">
          <label className="mb-1 text-sm lg:text-lg text-secondary">Tags</label>
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-md bg-secondary border border-accent/20">
            {(localMix.tags || []).map((tag, idx) => (
              <span
                key={idx}
                className="bg-accent-content/20 text-primary px-2 py-1 rounded-full text-xs flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-accent-content/70 hover:text-accent-content text-xs"
                >
                  ✕
                </button>
              </span>
            ))}

            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
              placeholder="Type and press Enter..."
              className="flex-1 w-full p-3 bg-transparent text-primary outline-none text-sm"
            />
          </div>

          {filteredSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filteredSuggestions.map((tag) => (
                <button
                  key={tag}
                  onClick={(e) => handleAddTag(e, tag)}
                  className="px-3 py-1 bg-accent-content/10 text-primary rounded-full text-xs hover:bg-accent-content/30 transition"
                >
                  + {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ingredients Builder */}
      <div className="border border-accent/30 rounded-md p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg text-secondary">Ingredients</h3>
          <button
            type="button"
            onClick={addIngredient}
            className="flex items-center gap-2 bg-accent text-accent-content px-3 py-1 rounded hover:bg-accent/80"
          >
            <FaPlus /> Add Ingredient
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-accent text-accent-content">
              <th className="border-secondary border-2 px-2 py-1">Spice</th>
              <th className="border-secondary border-2 px-2 py-1">Grams</th>
              <th className="border-secondary border-2 px-2 py-1">Adjust</th>
              <th className="border-secondary border-2 px-2 py-1">Remove</th>
            </tr>
          </thead>
          <tbody>
            {(localMix.ingredients || []).map((ing, idx) => (
              <tr key={idx}>
                <td>
                  <select
                    value={ing.spice}
                    onChange={(e) =>
                      updateIngredient(idx, "spice", e.target.value)
                    }
                    className="w-full bg-secondary text-primary border border-accent/30 rounded px-2 py-1"
                  >
                    <option value="">Select spice...</option>
                    {spices
                      .filter((s) => s.isActive)
                      .map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name} (Stock: {s.stockInGrams}g)
                        </option>
                      ))}
                  </select>
                </td>

                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={ing.grams}
                    onChange={(e) =>
                      updateIngredient(idx, "grams", e.target.value)
                    }
                    className="w-full bg-secondary text-primary border border-accent/30 rounded px-2 py-1 no-spinner"
                  />
                  {ing.spice && (
                    <p className="text-xs text-red-400 mt-1">
                      Max available: {getAvailableForSpice(ing.spice)} g
                    </p>
                  )}
                </td>

                <td className="p-1">
                  <div className="flex flex-wrap gap-1 justify-between">
                    {ADJUST_STEPS.map((step) => (
                      <button
                        type="button"
                        key={step}
                        onClick={() => adjustValue(idx, step)}
                        className="px-2 py-1 text-base rounded bg-accent/80 hover:bg-accent transition text-accent-content"
                      >
                        {step > 0 ? `+${step}` : step}
                      </button>
                    ))}
                  </div>
                </td>

                <td className="text-center">
                  <button
                    type="button"
                    onClick={() => removeIngredient(idx)}
                    className="text-accent-content/60 hover:text-accent-content transition"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-sm text-secondary">
          Total: <strong>{totalGrams} g</strong>
        </p>

        <p className="text-sm text-secondary">
          Cost per 100g: <strong>€{costPer100g}</strong>
        </p>

        {!validate() && (
          <p className="text-red-500 text-sm">
            ⚠ Please fill all spices and amounts before saving.
          </p>
        )}
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
