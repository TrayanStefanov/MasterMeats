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
    sort: "createdAt",
    limit: 10,
  },
  selectedClient: null,

  fetchClients: async (page = 1) => {
    const { filters } = get();
    set({ loading: true, error: null });

    try {
      const query = new URLSearchParams({
        ...filters,
        page,
      }).toString();

      const res = await axios.get(`/api/clients?${query}`);
      set({
        clients: res.data.clients,
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        totalCount: res.data.totalCount,
        loading: false,
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
      }));
      toast.success("Client created successfully!");
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create client";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  updateClient: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/api/clients/${id}`, updates);
      set((state) => ({
        clients: state.clients.map((c) =>
          c._id === id ? res.data : c
        ),
        loading: false,
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
      set((state) => ({
        clients: state.clients.filter((c) => c._id !== clientId),
        loading: false,
      }));
      toast.success("Client deleted successfully!");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete client";
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
      filters: {
        search: "",
        sort: "createdAt",
        limit: 10,
      },
    }),

  setSelectedClient: (client) => set({ selectedClient: client }),
}));
