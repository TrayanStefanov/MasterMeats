import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useClientStore } from "../stores/useClientStore";

export default function ClientFilters() {
  const { filters, setFilter, availableTags = [], fetchAvailableTags } = useClientStore();
  const { t: tUAC } = useTranslation("admin/usersAndClients");
  const { t: tCommon } = useTranslation("admin/common");

  const [tagInput, setTagInput] = useState("");
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [suggestions, setSuggestions] = useState([]);

  // Load available tags once
  useEffect(() => {
    fetchAvailableTags?.();
  }, []);

  // Debounced search filter
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilter("search", searchInput.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Suggest tags dynamically
  useEffect(() => {
    if (!tagInput.trim()) {
      setSuggestions([]);
      return;
    }
    const input = tagInput.toLowerCase();
    const matches = availableTags
      .filter(
        (tag) =>
          tag.toLowerCase().includes(input) &&
          !(filters.tags || []).includes(tag)
      )
      .slice(0, 5); // limit results
    setSuggestions(matches);
  }, [tagInput, availableTags, filters.tags]);

  // Add tag (from input or suggestion)
  const addTag = (tag) => {
    const currentTags = filters.tags || [];
    if (!currentTags.includes(tag)) {
      setFilter("tags", [...currentTags, tag]);
    }
    setTagInput("");
    setSuggestions([]);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const newTag = tagInput.trim();
    if (!newTag) return;
    addTag(newTag);
  };

  const handleRemoveTag = (tagToRemove) => {
    setFilter(
      "tags",
      filters.tags.filter((t) => t !== tagToRemove)
    );
  };

  const clearAllTags = () => setFilter("tags", []);

  return (
    <div className="min-w-[90%] mx-auto bg-primary/60 rounded-lg border border-accent/30 p-4">
      <h2 className="text-accent-content text-2xl text-center mb-4">
        {tUAC("filters.title", { defaultValue: "Filters" })}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Field */}
        <div className="flex flex-col">
          <label className="text-secondary/70 text-sm font-semibold mb-1">
            {tUAC("filters.searchLabel", { defaultValue: "Search Clients" })}
          </label>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={tUAC("filters.searchPlaceholder", {
              defaultValue: "Search by name, phone, or email...",
            })}
            className="bg-secondary text-primary border border-accent/30 rounded-md px-3 py-2 text-sm outline-none placeholder:text-primary/50 w-full h-[42px]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-col">
          <label className="text-secondary/70 text-sm font-semibold mb-1">
            {tUAC("filters.status", { defaultValue: "Status" })}
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilter("status", e.target.value)}
            className="bg-secondary text-primary border border-accent/30 rounded-md px-3 py-2 text-sm outline-none w-full h-[42px]"
          >
            <option value="all">{tUAC("filters.statusAll", { defaultValue: "All" })}</option>
            <option value="pending">{tUAC("filters.statusPending", { defaultValue: "Pending" })}</option>
            <option value="completed">{tUAC("filters.statusCompleted", { defaultValue: "Completed" })}</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-col">
          <label className="text-secondary/70 text-sm font-semibold mb-1">
            {tUAC("filters.dateRange", { defaultValue: "Delivery Date" })}
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilter("dateRange", e.target.value)}
            className="bg-secondary text-primary border border-accent/30 rounded-md px-3 py-2 text-sm outline-none w-full h-[42px]"
          >
            <option value="all">{tUAC("filters.dateAll", { defaultValue: "All Dates" })}</option>
            <option value="today">{tUAC("filters.dateToday", { defaultValue: "Today" })}</option>
            <option value="tomorrow">{tUAC("filters.dateTomorrow", { defaultValue: "Tomorrow" })}</option>
            <option value="week">{tUAC("filters.dateWeek", { defaultValue: "This Week" })}</option>
          </select>
        </div>

        {/* Tags Field */}
        <div className="flex flex-col relative md:col-span-3 mt-2 md:mt-0">
          <label className="text-secondary/70 text-sm font-semibold mb-1">
            {tUAC("filters.tags", { defaultValue: "Filter by Tags" })}
          </label>

          <div className="flex items-center flex-wrap gap-2 bg-secondary border border-accent/30 rounded-md px-3 py-1.5 min-h-[42px]">
            {filters.tags?.length > 0 &&
              filters.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-accent-content/20 text-primary px-2 py-1 rounded-full text-xs flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-accent-content/70 hover:text-accent-content text-xs"
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}

            <form onSubmit={handleAddTag} className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder={tUAC("filters.addTagPlaceholder", {
                  defaultValue: "Add tag and press Enter...",
                })}
                className="bg-transparent text-primary outline-none text-sm px-1 w-full placeholder:text-primary/50"
              />
            </form>

            {filters.tags?.length > 0 && (
              <button
                onClick={clearAllTags}
                className="text-xs text-accent-content/60 hover:text-accent-content ml-auto"
              >
                {tCommon("clear", { defaultValue: "Clear" })}
              </button>
            )}
          </div>

          {/* Tag suggestions as pills */}
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestions.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => addTag(tag)}
                  className="bg-accent-content/20 hover:bg-accent-content/30 text-primary px-3 py-1 rounded-full text-xs transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {(!filters.tags || filters.tags.length === 0) && suggestions.length === 0 && (
            <p className="text-secondary/60 text-sm italic mt-2">
              {tUAC("filters.noTags", { defaultValue: "No tag filters active" })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
