import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaSearch, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useDebounce } from "../../hooks/useDebounce";
import { useTranslation } from "react-i18next";

const ClientSearch = ({ onSelect, selectedClient }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const inputRef = useRef(null);

  const { t: tUAC } = useTranslation("admin/usersAndClients");
  const { t: tCommon } = useTranslation("admin/common");

  // Fetch clients based on debounced query
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/clients?search=${encodeURIComponent(debouncedQuery)}`
        );
        setResults(res.data.clients || []);
      } catch (err) {
        console.error("Error searching clients:", err);
        toast.error("Failed to search clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [debouncedQuery]);

  const handleSelect = (client) => {
    onSelect(client);
    setQuery("");
    setResults([]);
  };

  const handleRemove = () => {
    onSelect(null); // Clear selected client
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-2 relative">
      <label className="block indent-2 lg:text-xl xl:text-2xl font-medium text-secondary">
        {tCommon("searchClient.title")}
      </label>

      <div
        className={`flex items-center flex-wrap border border-secondary rounded-lg p-1 focus-within:ring-2 focus-within:ring-accent transition`}
      >
        {selectedClient && selectedClient._id && selectedClient.name ? (
          <span className="flex items-center text-secondary p-1 rounded-lg mr-1 mb-1 text-sm lg:text-base xl:text-lg">
            {selectedClient.name}
            <button
              type="button"
              onClick={() => handleRemove()}
              className="ml-1 text-secondary hover:text-accent-content align-middle "
            >
              <FaTimes className="w-3 h-3" />
            </button>
          </span>
        ) : null}

        <input
          ref={inputRef}
          type="text"
          placeholder={
            !selectedClient || !selectedClient._id
              ? tCommon("searchClient.placeholder")
              : ""
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 min-w-[120px] border-none rounded-lg bg-secondary placeholder:text-primary/60 outline-none px-1 py-1 text-sm lg:text-base xl:text-lg indent-2 placeholder:text-gray-400"
        />
      </div>

      {/* Search results dropdown */}
      {loading && <p className="text-sm text-gray-500 mt-1">Searching...</p>}

      {!loading && results.length > 0 && (
        <div className="p-2 border rounded-lg max-h-60 overflow-y-auto shadow-sm bg-white mt-1">
          {results.map((client) => (
            <button
              key={client._id}
              type="button"
              onClick={() => handleSelect(client)}
              className="flex justify-between items-center w-full text-left p-2 rounded-md hover:bg-accent/10"
            >
              <div>
                <p className="font-medium text-gray-800">{client.name}</p>
                <p className="text-sm text-gray-500">{client.phone}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && query.trim() && results.length === 0 && (
        <p className="text-sm text-secondary italic mt-1">{tUAC("empty")}</p>
      )}
    </div>
  );
};

export default ClientSearch;
