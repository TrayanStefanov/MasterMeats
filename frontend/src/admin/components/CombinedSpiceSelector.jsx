import { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";

const CombinedSpiceSelector = ({
  spices = [],
  mixes = [],
  value,              
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Build unified list
  const list = [
    { label: "Spices", type: "header" },
    ...spices.map((s) => ({ ...s, type: "spice" })),
    { label: "Mixes", type: "header" },
    ...mixes.map((m) => ({ ...m, type: "mix" })),
  ];

  // Live filtering (exclude headers from filtering)
  const filtered = list.filter((item) => {
    if (item.type === "header") return true;
    return item.name.toLowerCase().includes(search.toLowerCase());
  });

  const selectedLabel = (() => {
    if (!value) return "Select spice or mix";

    if (value.type === "spice") {
      return spices.find((s) => s._id === value.id)?.name || "Unknown spice";
    }
    if (value.type === "mix") {
      return mixes.find((m) => m._id === value.id)?.name || "Unknown mix";
    }
    return "Select spice or mix";
  })();

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Select Box */}
      <div
        className="select select-bordered w-full flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {selectedLabel}
        <FaChevronDown className={`ml-2 transition ${open ? "rotate-180" : ""}`} />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-base-200 border rounded-xl shadow-lg max-h-64 overflow-y-auto p-2">
          
          {/* Search Box */}
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search spices/mixes..."
            className="input input-bordered w-full mb-2"
          />

          {/* List */}
          {filtered.map((item, idx) =>
            item.type === "header" ? (
              <div
                key={idx}
                className="text-xs opacity-60 mt-2 mb-1 font-bold uppercase"
              >
                {item.label}
              </div>
            ) : (
              <div
                key={item._id}
                className="p-2 rounded-lg hover:bg-base-300 cursor-pointer"
                onClick={() => {
                  onChange({ id: item._id, type: item.type });
                  setOpen(false);
                  setSearch("");
                }}
              >
                {item.name}
                <span className="opacity-60 ml-1 text-sm">
                  ({item.stockInGrams} g)
                </span>
              </div>
            )
          )}

          {filtered.filter((i) => i.type !== "header").length === 0 && (
            <div className="p-2 text-center opacity-50">No matches</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CombinedSpiceSelector;
