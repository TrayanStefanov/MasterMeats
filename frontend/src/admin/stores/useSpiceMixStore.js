import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useSpiceMixStore = create((set, get) => ({
  spiceMixes: [],
  availableTags: [],
  loading: false,
  error: null,
  filters: { search: "", limit: 10, isActive: "all", tags: [] },

  fetchSpiceMixes: async () => {
    const { filters } = get();
    set({ loading: true, error: null });

    try {
      const queryObj = { limit: filters.limit };
      if (filters.search) queryObj.search = filters.search;
      if (filters.isActive !== "all") queryObj.isActive = filters.isActive;
      if (filters.tags?.length) queryObj.tags = filters.tags.join(",");

      const query = new URLSearchParams(queryObj).toString();
      const res = await axios.get(`/api/spicemixes?${query}`);
      const mixes = res.data || [];
      const tags = [...new Set(mixes.flatMap((m) => m.tags || []))];

      set({ spiceMixes: mixes, availableTags: tags, loading: false });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch spice mixes";
      set({ loading: false, error: msg });
      toast.error(msg);
    }
  },

  createSpiceMix: async (data) => {
    set({ loading: true, error: null });
    try {
      const totalGrams = (data.ingredients || []).reduce((sum, i) => sum + (i.grams || 0), 0);

      for (const ing of data.ingredients || []) {
        if (!ing.spice || !ing.grams) continue;
        await axios.put(`/api/spices/${ing.spice}`, { $inc: { stockInGrams: -ing.grams } });
      }

      const res = await axios.post("/api/spicemixes", { ...data, stockInGrams: totalGrams });

      set((state) => ({
        spiceMixes: [res.data, ...state.spiceMixes],
        availableTags: [...new Set([...state.availableTags, ...(res.data.tags || [])])],
        loading: false,
      }));

      toast.success("Spice mix created successfully!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create spice mix";
      set({ loading: false, error: msg });
      toast.error(msg);
      throw err;
    }
  },

  updateSpiceMix: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/api/spicemixes/${id}`, updates);
      set((state) => ({
        spiceMixes: state.spiceMixes.map((m) => (m._id === id ? res.data : m)),
        availableTags: [...new Set([...state.availableTags, ...(res.data.tags || [])])],
        loading: false,
      }));
      toast.success("Spice mix updated successfully!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update spice mix";
      set({ loading: false, error: msg });
      toast.error(msg);
      throw err;
    }
  },

  deleteSpiceMix: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/spicemixes/${id}`);
      set((state) => ({
        spiceMixes: state.spiceMixes.filter((m) => m._id !== id),
        loading: false,
      }));
      toast.success("Spice mix deleted successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete spice mix";
      set({ loading: false, error: msg });
      toast.error(msg);
    }
  },

  addStockToMix: async (mixId, gramsToAdd) => {
    if (!gramsToAdd || gramsToAdd <= 0) return;

    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/api/spicemixes/${mixId}/addStock`, { increaseBy: gramsToAdd });
      const updatedMix = res.data;

      set((state) => ({
        spiceMixes: state.spiceMixes.map((m) => (m._id === mixId ? updatedMix : m)),
        loading: false,
      }));

      toast.success(`Added ${gramsToAdd} g to ${updatedMix.name}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add stock";
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

  resetFilters: () => set({ filters: { search: "", limit: 10, isActive: "all", tags: [] } }),
}));
