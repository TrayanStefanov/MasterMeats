import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useSpiceStore = create((set, get) => ({
  spices: [],
  loading: false,
  error: null,
  filters: { search: "", limit: 10, isActive: "all" },
  selectedSpice: null,

  fetchSpices: async (page = 1) => {
    const { filters } = get();
    set({ loading: true, error: null });

    try {
      const queryObj = { page, limit: filters.limit };
      if (filters.search) queryObj.search = filters.search;
      if (filters.isActive !== "all") queryObj.isActive = filters.isActive;

      const query = new URLSearchParams(queryObj).toString();
      const res = await axios.get(`/api/spices?${query}`);
      set({ spices: res.data.spices || [], loading: false });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch spices";
      set({ loading: false, error: msg });
      toast.error(msg);
    }
  },

  createSpice: async (spiceData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/api/spices", spiceData);
      set((state) => ({ spices: [res.data, ...state.spices], loading: false }));
      toast.success("Spice created successfully!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create spice";
      set({ loading: false, error: msg });
      toast.error(msg);
      throw err;
    }
  },

  updateSpice: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/api/spices/${id}`, updates);
      set((state) => ({
        spices: state.spices.map((s) => (s._id === id ? res.data : s)),
        loading: false,
      }));
      toast.success("Spice updated successfully!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update spice";
      set({ loading: false, error: msg });
      toast.error(msg);
      throw err;
    }
  },

  deleteSpice: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/spices/${id}`);
      set((state) => ({
        spices: state.spices.filter((s) => s._id !== id),
        loading: false,
      }));
      toast.success("Spice deleted successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete spice";
      set({ loading: false, error: msg });
      toast.error(msg);
    }
  },

  // Filters
  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },

  resetFilters: () => set({ filters: { search: "", limit: 10, isActive: "all" } }),
  setSelectedSpice: (spice) => set({ selectedSpice: spice }),
}));
