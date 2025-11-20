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

}));
