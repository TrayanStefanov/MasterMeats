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
    products: [],
    statusFilter: "showCurrent", // Default filter."showCurrent", "showAll", "showCompleted", "deliveredNotPaid", "paidNotDelivered", "reserved"
    sort: "deliveryDate",
    limit: 10,
  },
  selectedReservation: null,

  fetchFilteredReservations: async (page = 1) => {
    const { filters } = get();
    set({ loading: true, error: null });

    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", filters.limit);
      params.append("sort", filters.sort);

      if (filters.search) params.append("search", filters.search.trim());
      if (filters.products?.length)
        params.append("products", filters.products.join(","));

      if (filters.statusFilter)
        params.append("statusFilter", filters.statusFilter);

      const res = await axios.get(`/api/reservations?${params.toString()}`);

      set({
        reservations: res.data.reservations,
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        totalCount: res.data.totalCount,
        loading: false,
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch reservations";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  createReservation: async (reservationData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`/api/reservations`, reservationData);
      toast.success("Reservation created successfully!");
      await get().fetchFilteredReservations();
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create reservation";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  updateReservation: async (reservationId, updates) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(
        `/api/reservations/${reservationId}`,
        updates
      );
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r._id === reservationId ? res.data : r
        ),
        loading: false,
      }));
      toast.success("Reservation updated successfully!");
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update reservation";
      set({ loading: false, error: message });
      toast.error(message);
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
      toast.success("Reservation deleted successfully!");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete reservation";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  setFilter: (key, value) => {
    set((state) => {
      const newFilters = { ...state.filters, [key]: value };
      return { filters: newFilters };
    });
    // Immediately fetch new data whenever a filter changes
    get().fetchFilteredReservations(1); // reset to page 1
  },

  resetFilters: () =>
    set({
      filters: {
        search: "",
        products: [],
        statusFilter: "showCurrent", // Default filter
        sort: "deliveryDate",
        limit: 10,
      },
    }),

  setSelectedReservation: (reservation) =>
    set({ selectedReservation: reservation }),
}));
