import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useReservationStore = create((set, get) => ({
  reservations: [],
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  loading: false,
  error: null,
  filters: {
    search: "",
    category: "",
    productId: "",
    completed: "",
    amountDue: "",
    sort: "deliveryDate",
    limit: 10,
  },
  selectedReservation: null,

  fetchFilteredReservations: async (page = 1) => {
    const { filters } = get();
    set({ loading: true, error: null });

    try {
      const query = new URLSearchParams({
        ...filters,
        page,
      }).toString();

      const res = await axios.get(`/api/reservations?${query}`);
      set({
        reservations: res.data.reservations,
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        totalCount: res.data.totalCount,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch reservations",
    });
    toast.error(error.response?.data?.message || "Failed to fetch reservations")
    }
  },

  createReservation: async (reservationData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`/api/reservations`, reservationData);
      set((state) => ({
        reservations: [res.data, ...state.reservations],
        loading: false,
      }));
      return res.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to create reservation",
      });
    }
  },

  updateReservation: async (reservationId, updates) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/api/reservations/${reservationId}`, updates);
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r._id === reservationId ? res.data : r
        ),
        loading: false,
      }));
      return res.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to update reservation",
      });
    }
  },

  deleteReservation: async (reservationId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/reservations/${reservationId}`);
      set((state) => ({
        reservations: state.reservations.filter((r) => r._id !== reservationId),
        loading: false,
      }));
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to delete reservation",
      });
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
        category: "",
        productId: "",
        completed: "",
        amountDue: "",
        sort: "deliveryDate",
        limit: 10,
      },
    }),

  setSelectedReservation: (reservation) =>
    set({ selectedReservation: reservation }),
}));
