import { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { useDebounce } from "../../hooks/useDebounce";
import { useSpiceMixStore } from "../stores/useSpiceMixStore";

export default function SpiceMixFilters() {
  const { filters, setFilter, availableTags } = useSpiceMixStore();

  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [statusFilter, setStatusFilter] = useState(filters.isActive || "all");
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const tagInputRef = useRef(null);

  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => setSearchInput(filters.search || ""), [filters.search]);
  useEffect(() => setStatusFilter(filters.isActive || "all"), [filters.isActive]);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilter("search", debouncedSearch);
    }
  }, [debouncedSearch]);

  const handleStatusChange = (val) => {
    setStatusFilter(val);
    setFilter("isActive", val);
  };

  useEffect(() => {
    if (!tagInput) return setTagSuggestions([]);
    const suggestions = (availableTags || [])
      .filter(
        (t) => t.toLowerCase().includes(tagInput.toLowerCase()) && !(filters.tags || []).includes(t)
      )
      .slice(0, 6);
    setTagSuggestions(suggestions);
  }, [tagInput, filters.tags, availableTags]);

  const handleAddTag = (tag) => {
    if (!tag) return;
    setFilter("tags", [...(filters.tags || []), tag]);
    setTagInput("");
    tagInputRef.current?.focus();
  };

  const handleRemoveTag = (tag) => {
    setFilter(
      "tags",
      (filters.tags || []).filter((t) => t !== tag)
    );
  };

  return (
    <div className="min-w-[90%] mx-auto rounded-md border-4 border-accent-content/60 p-4 mb-4 space-y-4">
      <h2 className="text-accent-content text-2xl xl:text-3xl text-center font-bold mb-4">
        Spice Mix Filters
      </h2>

      <div className="flex flex-col">
        <label className="text-secondary/70 mb-1 text-sm lg:text-lg">Search by Name</label>
        <input
          type="text"
          placeholder="Type mix name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="bg-secondary text-primary border border-accent/30 rounded-md px-3 py-2 outline-none"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-secondary/70 mb-1 text-sm lg:text-lg">Filter by Status</label>
        <div className="flex items-center gap-2">
          {["all", "true", "false"].map((val) => {
            const label = val === "all" ? "All" : val === "true" ? "Active" : "Inactive";
            const isSelected = statusFilter === val;
            return (
              <button
                key={val}
                onClick={() => handleStatusChange(val)}
                className={`px-3 py-1 rounded-full text-xs ${
                  isSelected ? "bg-accent-content text-primary" : "bg-secondary text-primary/70"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col relative">
        <label className="text-secondary/70 mb-1 text-sm lg:text-lg">Filter by Tag / Ingredient</label>
        <div className="flex flex-wrap border border-secondary rounded-lg p-1 focus-within:ring-2 focus-within:ring-accent transition">
          {(filters.tags || []).map((tag) => (
            <span
              key={tag}
              className="flex items-center bg-accent text-secondary p-2 rounded-lg mr-1 mb-1 text-sm lg:text-base"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-secondary hover:text-accent-content"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </span>
          ))}

          <input
            ref={tagInputRef}
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Type to search tags..."
            className="flex-1 min-w-[120px] border-none rounded-lg bg-secondary placeholder:text-primary/60 outline-none px-1 py-1 text-sm lg:text-base xl:text-lg indent-2"
          />
        </div>

        {tagSuggestions.length > 0 && (
          <div className="absolute bg-secondary/95 border border-accent/30 mt-1 rounded shadow max-h-40 overflow-y-auto z-10 w-full">
            {tagSuggestions.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleAddTag(t)}
                className="w-full text-left px-3 py-1 hover:bg-accent/20"
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
