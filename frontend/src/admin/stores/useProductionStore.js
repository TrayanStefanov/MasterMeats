import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useProductionStore = create((set, get) => ({
    loading: false,
    error: null,
/* Spices */
    spices: [],
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    filters: {
        search: "",
        limit: 10,
        isActive: "all",
    },
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

            const { spices, totalCount, totalPages, currentPage } = res.data;

            set({ spices, currentPage, totalPages, totalCount, loading: false });
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to fetch spices";
            set({ loading: false, error: message });
            toast.error(message);
        }
    },

    createSpice: async (spiceData) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.post(`/api/spices`, spiceData);

            set((state) => ({
                spices: [res.data, ...state.spices],
                loading: false,
            }));

            toast.success("Spice created successfully!");
            return res.data;
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to create spice";
            set({ loading: false, error: message });
            toast.error(message);
            throw error;
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
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to update spice";
            set({ loading: false, error: message });
            toast.error(message);
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
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to delete spice";
            set({ loading: false, error: message });
            toast.error(message);
        }
    },

    setFilter: (key, value) =>
        set((state) => ({
            filters: { ...state.filters, [key]: value },
        })),

    resetFilters: () =>
        set({
            filters: { search: "", limit: 10, isActive: "all" },
        }),

    setSelectedSpice: (spice) => set({ selectedSpice: spice }),

    /* Spice Mixes */

    spiceMixes: [],
    spiceMixAvailableTags: [],

    fetchSpiceMixes: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get("/api/spicemixes");
            const mixes = res.data;

            const tags = [...new Set(mixes.flatMap((m) => m.tags || []))];

            set({ spiceMixes: mixes, spiceMixAvailableTags: tags, loading: false });
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to fetch spice mixes";
            set({ loading: false, error: msg });
            toast.error(msg);
        }
    },

    createSpiceMix: async (data) => {
        set({ loading: true, error: null });
        try {
            const totalGrams = (data.ingredients || []).reduce(
                (sum, ing) => sum + (ing.grams || 0),
                0
            );

            for (const ing of data.ingredients || []) {
                if (!ing.spice || !ing.grams) continue;
                await axios.put(`/api/spices/${ing.spice}`, {
                    $inc: { stockInGrams: -ing.grams },
                });
            }

            const res = await axios.post("/api/spicemixes", {
                ...data,
                stockInGrams: totalGrams,
            });

            set((state) => ({
                spiceMixes: [res.data, ...state.spiceMixes],
                spiceMixAvailableTags: [
                    ...new Set([...state.spiceMixAvailableTags, ...(res.data.tags || [])]),
                ],
                loading: false,
            }));

            toast.success("Spice mix created successfully!");
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to create spice mix";
            set({ loading: false, error: msg });
            toast.error(msg);
        }
    },

    updateSpiceMix: async (id, updates) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.put(`/api/spicemixes/${id}`, updates);

            set((state) => ({
                spiceMixes: state.spiceMixes.map((m) =>
                    m._id === id ? res.data : m
                ),
                spiceMixAvailableTags: [
                    ...new Set([...state.spiceMixAvailableTags, ...(res.data.tags || [])]),
                ],
                loading: false,
            }));

            toast.success("Spice mix updated successfully!");
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to update spice mix";
            set({ loading: false, error: msg });
            toast.error(msg);
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
            const res = await axios.put(`/api/spicemixes/${mixId}/addStock`, {
                increaseBy: gramsToAdd,
            });

            const updatedMix = res.data;

            set((state) => ({
                spiceMixes: state.spiceMixes.map((m) =>
                    m._id === mixId ? updatedMix : m
                ),
            }));

            const spicesRes = await axios.get("/api/spices");
            set({ spices: spicesRes.data, loading: false });

            toast.success(`Added ${gramsToAdd} g to ${updatedMix.name}`);
        } catch (err) {
            const msg =
                err.response?.data?.message || "Failed to add stock to spice mix";
            set({ loading: false, error: msg });
            toast.error(msg);
        }
    },
}));
