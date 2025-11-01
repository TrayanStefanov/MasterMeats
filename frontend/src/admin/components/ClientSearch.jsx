import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-hot-toast"; // keeping consistency with your other files
import { useDebounce } from "../../hooks/useDebounce";

const ClientSearch = ({ onSelect, selectedClient }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/clients?search=${encodeURIComponent(debouncedQuery)}`);
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

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Search Client
      </label>

      <div className="relative">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-lg py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-accent transition"
        />
        <FaSearch className="absolute right-3 top-3 text-gray-400 w-4 h-4" />
      </div>

      {loading && <p className="text-sm text-gray-500">Searching...</p>}

      {!loading && results.length > 0 && (
        <div className="p-2 border rounded-lg max-h-60 overflow-y-auto shadow-sm bg-white">
          {results.map((client) => (
            <button
              key={client._id}
              type="button"
              onClick={() => handleSelect(client)}
              className={`flex justify-between items-center w-full text-left p-2 rounded-md hover:bg-accent/10 ${
                selectedClient?._id === client._id ? "bg-accent/20" : ""
              }`}
            >
              <div>
                <p className="font-medium text-gray-800">{client.name}</p>
                <p className="text-sm text-gray-500">{client.phone}</p>
              </div>
              {selectedClient?._id === client._id && (
                <FaCheckCircle className="text-green-500 w-4 h-4" />
              )}
            </button>
          ))}
        </div>
      )}

      {!loading && query.trim() && results.length === 0 && (
        <p className="text-sm text-gray-500 italic">No clients found.</p>
      )}

      {selectedClient && (
        <div className="mt-2 text-sm text-gray-600">
          Selected:{" "}
          <span className="font-medium text-gray-900">
            {selectedClient.name}
          </span>{" "}
          ({selectedClient.phone})
        </div>
      )}
    </div>
  );
};

export default ClientSearch;
