import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useClientStore = create((set, get) => ({
  clients: [],
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  loading: false,
  error: null,
  filters: {
    search: "",
    limit: 10,
    tags: [],
    status: "all",
    hideCompletedOnly: false,
  },
  selectedClient: null,
  availableTags: [],

  fetchClients: async (page = 1) => {
    const { filters } = get();
    set({ loading: true, error: null });

    try {
      const queryObj = {
        page,
        limit: filters.limit,
      };
      if (filters.search) queryObj.search = filters.search;
      if (filters.status !== "all") queryObj.status = filters.status;
      if (filters.tags?.length) queryObj.tags = filters.tags.join(",");
      if (filters.hideCompletedOnly) queryObj.hideCompletedOnly = true;

      const query = new URLSearchParams(queryObj).toString();
      const res = await axios.get(`/api/clients?${query}`);

      const { clients, totalCount, totalPages, currentPage, availableTags } =
        res.data;

      set({
        clients,
        currentPage,
        totalPages,
        totalCount,
        loading: false,
        availableTags, // get tags from backend
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch clients";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  createClient: async (clientData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`/api/clients`, clientData);
      set((state) => ({
        clients: [res.data, ...state.clients],
        loading: false,
        availableTags: [
          ...new Set([...state.availableTags, ...(res.data.tags || [])]),
        ], // merge locally
      }));
      toast.success("Client created successfully!");
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create client";
      set({ loading: false, error: message });
      toast.error(message);
      throw error;
    }
  },

  updateClient: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/api/clients/${id}`, updates);
      set((state) => ({
        clients: state.clients.map((c) => (c._id === id ? res.data : c)),
        loading: false,
        availableTags: [
          ...new Set([...state.availableTags, ...(res.data.tags || [])]),
        ], // merge locally
      }));
      toast.success("Client updated successfully!");
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update client";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  deleteClient: async (clientId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/clients/${clientId}`);
      set((state) => {
        const remainingClients = state.clients.filter(
          (c) => c._id !== clientId
        );
        const remainingTags = [
          ...new Set(remainingClients.flatMap((c) => c.tags || [])),
        ];
        return {
          clients: remainingClients,
          loading: false,
          availableTags: remainingTags,
        };
      });
      toast.success("Client deleted successfully!");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete client";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),

  resetFilters: () =>
    set({
      filters: {
        search: "",
        limit: 10,
        tags: [],
        status: "all",
        hideCompletedOnly: false,
      },
    }),

  setSelectedClient: (client) => set({ selectedClient: client }),
}));
