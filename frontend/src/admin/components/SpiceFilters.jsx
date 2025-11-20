import { useState, useEffect } from "react";
import { useSpiceStore } from "../stores/useSpiceStore";

export default function SpiceFilters() {
  const { filters, setFilter } = useSpiceStore();
  const [searchInput, setSearchInput] = useState(filters?.search || "");

  useEffect(() => {
    setSearchInput(filters?.search || "");
  }, [filters?.search]);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput.trim() !== filters?.search) {
        setFilter("search", searchInput.trim());
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput, filters?.search, setFilter]);

  return (
    <div className="min-w-[90%] mx-auto rounded-md border-4 border-accent-content/60 p-4 mb-4">
      <h2 className="text-accent-content text-2xl xl:text-3xl text-center font-bold mb-4">
        Spice Filters
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-secondary/70 mb-1 text-sm lg:text-lg">
            Search by Name or Supplier
          </label>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Type name or supplier..."
            className="bg-secondary text-primary border border-accent/30 rounded-md px-3 py-2 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-secondary/70 mb-1 text-sm lg:text-lg">
            Filter by Status
          </label>
          <div className="flex items-center gap-2">
            {["all", "true", "false"].map((val) => {
              const label =
                val === "all" ? "All" : val === "true" ? "Active" : "Inactive";
              const isSelected = filters?.isActive === val;
              return (
                <button
                  key={val}
                  onClick={() => setFilter("isActive", val)}
                  className={`px-3 py-1 rounded-full text-xs ${
                    isSelected
                      ? "bg-accent-content text-primary"
                      : "bg-secondary text-primary/70"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
