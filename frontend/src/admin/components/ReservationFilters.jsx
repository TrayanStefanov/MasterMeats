import { useState, useEffect } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useReservationStore } from "../stores/useReservationStore";
import { useProductStore } from "../../stores/useProductStore";

export default function ReservationFilters() {
  const { filters, setFilter } = useReservationStore();
  const { products: allProducts, fetchAllProducts } = useProductStore();
  const { t: tReservation } = useTranslation("admin/reservations");
  const { t: tCommon } = useTranslation("admin/common");
  const { t: tProducts } = useTranslation("productsSection");
  const { t: tUAC } = useTranslation("admin/usersAndClients");

  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [productSearch, setProductSearch] = useState("");
  const [productSuggestions, setProductSuggestions] = useState([]);

  // Fetch all products once
  useEffect(() => {
    fetchAllProducts?.();
  }, []);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilter("search", searchInput.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    if (!productSearch.trim()) {
      setProductSuggestions([]);
      return;
    }

    const input = productSearch.toLowerCase();

    //  Search by both Mongo key AND localized title
    const matches = allProducts
      .filter((p) => {
        const mongoName = p.name?.toLowerCase() || "";
        const localizedName = tProducts(
          `${p.name}.title`,
          p.name
        ).toLowerCase();
        return (
          (mongoName.includes(input) || localizedName.includes(input)) &&
          !(filters.products || []).includes(p._id)
        );
      })
      .slice(0, 6);

    setProductSuggestions(matches);
  }, [productSearch, allProducts, filters.products, tProducts]);

  // Add or remove product filter
  const toggleProduct = (productId) => {
    const selected = filters.products || [];
    if (selected.includes(productId)) {
      setFilter(
        "products",
        selected.filter((id) => id !== productId)
      );
    } else {
      setFilter("products", [...selected, productId]);
    }
  };

  const clearProducts = () => setFilter("products", []);

  return (
    <div className="min-w-[90%] mx-auto rounded-md border-4 border-accent-content/60 p-4">
      <h2 className="text-accent-content text-2xl xl:text-3xl 2xl:text-4xl font-bold text-center mb-8">
        {tReservation("filters.title", { defaultValue: "Reservation Filters" })}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Clients */}
        <div className="flex flex-col">
          <label className="text-accent-content indent-2 text-sm lg:text-lg xl:text-xl font-semibold mb-1">
            {tReservation("filters.search", {
              defaultValue: "Search by client name or phone",
            })}
          </label>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={tReservation("filters.searchPlaceholder", {
              defaultValue: "e.g. John Doe or 555-1234",
            })}
            className="bg-secondary text-primary border border-accent/30 rounded-md px-3 py-2 text-sm outline-none placeholder:text-primary/50 w-full h-[42px]"
          />
        </div>

        {/* Toggle Filters */}
        <div className="flex flex-col">
          <label className="text-accent-content indent-2 text-sm lg:text-lg xl:text-xl font-semibold mb-1">
            {tReservation("filters.statusFilters", {
              defaultValue: "Quick Filters",
            })}
          </label>

          <div className="flex flex-wrap gap-2 mt-1">
            {[
              { key: "completed", label: "Completed" },
              { key: "deliveredNotPaid", label: "Delivered but Not Paid" },
              { key: "paidNotDelivered", label: "Paid but Not Delivered" },
              { key: "reserved", label: "Reserved" },
            ].map((filterOption) => {
              const isActive = filters.statusFilter === filterOption.key;
              return (
                <button
                  key={filterOption.key}
                  onClick={() =>
                    setFilter(
                      "statusFilter",
                      isActive ? "" : filterOption.key // empty string deselects
                    )
                  }
                  className={`px-3 py-1 rounded-full text-sm lg:text-base transition-colors font-semibold ${
                    isActive
                      ? "bg-accent-content text-primary"
                      : "bg-secondary text-primary/70 hover:bg-secondary/70"
                  }`}
                >
                  {filterOption.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Filters */}
        <div className="flex flex-col md:col-span-2 mt-2 md:mt-0">
          <label className="text-accent-content indent-2 text-sm lg:text-lg xl:text-xl font-semibold mb-1">
            {tReservation("filters.products", {
              defaultValue: "Filter by Products",
            })}
          </label>

          <div className="flex flex-wrap gap-2 bg-secondary border border-accent/30 rounded-md px-3 py-2 min-h-[42px]">
            {filters.products?.length > 0 &&
              filters.products.map((productId) => {
                const p = allProducts.find((x) => x._id === productId);
                const localizedName = p
                  ? tProducts(`${p.name}.title`, p.name)
                  : "Unknown";
                return (
                  <span
                    key={productId}
                    className="bg-accent-content/40 text-primary px-2 py-1 rounded-full text-xs lg:text-lg flex items-center gap-1"
                  >
                    {localizedName}
                    <button
                      onClick={() => toggleProduct(productId)}
                      className="text-primary hover:text-accent text-xs lg:text-lg"
                    >
                      <FaTimes />
                    </button>
                  </span>
                );
              })}

            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder={tReservation("filters.addProductPlaceholder", {
                  defaultValue: "Search product...",
                })}
                className="bg-transparent text-primary outline-none text-xs lg:text-lg px-1 w-full placeholder:text-primary/50"
              />
            </div>

            {filters.products?.length > 0 && (
              <button
                onClick={clearProducts}
                className="text-xs lg:text-lg text-primary hover:text-accent font-semibold ml-auto"
              >
                {tCommon("clear", { defaultValue: "Clear" })}
              </button>
            )}
          </div>

          {productSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {productSuggestions.map((p) => {
                const localizedName = tProducts(`${p.name}.title`, p.name);
                return (
                  <button
                    key={p._id}
                    onClick={() => toggleProduct(p._id)}
                    className="bg-secondary/40 hover:bg-accent-content/60 text-primary px-3 py-1 rounded-full text-xs lg:text-base transition-colors flex items-center gap-1"
                  >
                    <FaPlus className="w-3 h-3" /> {localizedName}
                  </button>
                );
              })}
            </div>
          )}
          {(!filters.products || filters.products.length === 0) &&
            productSuggestions.length === 0 && (
              <p className="text-secondary/60 indent-2 text-sm italic mt-2">
                {tReservation("filters.noProducts", {
                  defaultValue: "No product filters active",
                })}
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
