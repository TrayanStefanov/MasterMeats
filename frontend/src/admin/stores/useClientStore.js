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
    tags: [],
  },
  selectedClient: null,
  availableTags: [], 
  
  fetchClients: async (page = 1) => {
    const { filters } = get();
    set({ loading: true, error: null });

    try {
      const queryObj = {
        ...filters,
        page,
      };

      if (filters.tags?.length) {
        queryObj.tags = filters.tags.join(",");
      }

      const query = new URLSearchParams(queryObj).toString();
      const res = await axios.get(`/api/clients?${query}`);

      // Derive additional UI-friendly fields
      const clientsWithDerived = res.data.clients.map((c) => ({
        ...c,
        totalReservations: c.reservations?.length || 0,
        lastOrder: c.reservations?.[0] || null,
      }));

      const uniqueTags = [
        ...new Set(
          clientsWithDerived.flatMap((c) => c.tags || [])
        ),
      ];

      set({
        clients: clientsWithDerived,
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        totalCount: res.data.totalCount,
        loading: false,
        availableTags: uniqueTags,
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

      const allTags = [
        ...new Set([
          ...get().availableTags,
          ...(res.data.tags || []),
        ]),
      ];
      set({ availableTags: allTags });

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
        clients: state.clients.map((c) =>
          c._id === id ? res.data : c
        ),
        loading: false,
      }));
      toast.success("Client updated successfully!");

      const updatedTags = [
        ...new Set([
          ...get().availableTags,
          ...(res.data.tags || []),
        ]),
      ];
      set({ availableTags: updatedTags });
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
      const remainingClients = get().clients.filter(
        (c) => c._id !== clientId
      );

      const remainingTags = [
        ...new Set(remainingClients.flatMap((c) => c.tags || [])),
      ];

      set({
        clients: remainingClients,
        loading: false,
        availableTags: remainingTags,
      });

      toast.success("Client deleted successfully!");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete client";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  fetchAvailableTags: async () => {
    try {
      const res = await axios.get(`/api/clients/tags`);
      set({ availableTags: res.data || [] });
    } catch (error) {
      console.warn("⚠️ Could not fetch available tags, using local fallback.");
      toast.error("Could not fetch available tags", error);
      // fallback: use currently loaded clients
      const tagsFromClients = [
        ...new Set(get().clients.flatMap((c) => c.tags || [])),
      ];
      set({ availableTags: tagsFromClients });
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
        tags: [],
      },
    }),

  setSelectedClient: (client) => set({ selectedClient: client }),
}));
