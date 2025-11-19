import { useState, useEffect, useRef, useMemo } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useProductionStore } from "../stores/useProductionStore";

const ADJUST_STEPS = [-50, -25, -10, -5, -2, -1, 0, 1, 2, 5, 10, 25, 50];

const SpiceMixForm = ({ mix, onChange }) => {
  const { spices = [], spiceMixAvailableTags } = useProductionStore();
  const [localMix, setLocalMix] = useState(mix);
  const [tagInput, setTagInput] = useState("");
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


  const allTags = useMemo(
    () => spiceMixAvailableTags || [],
    [spiceMixAvailableTags]
  );

  const filteredSuggestions = useMemo(() => {
    if (!tagInput) return [];
    return allTags
      .filter(
        (t) =>
          t.toLowerCase().startsWith(tagInput.toLowerCase()) &&
          !(localMix.tags || []).includes(t)
      )
      .slice(0, 6);
  }, [tagInput, allTags, localMix.tags]);

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
            {(localMix.tags || []).length > 0 ? (
              localMix.tags.map((tag, idx) => (
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
              ))
            ) : (
              <span className="text-primary/40 text-sm italic">
                No tags yet
              </span>
            )}
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
