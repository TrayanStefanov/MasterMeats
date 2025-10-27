import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useClientStore } from "./client.store";

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
      const message = error.response?.data?.message || "Failed to fetch reservations";
      set({ loading: false, error: message });
      toast.error(message);
    }
  },

  createReservation: async (reservationData) => {
    set({ loading: true, error: null });
    try {
      const clientStore = useClientStore.getState();
      const client = await clientStore.createOrFindClient(reservationData.client);

      // Replace client data with its ObjectId if it exists
      const payload = {
        ...reservationData,
        client: client._id,
      };

      const res = await axios.post(`/api/reservations`, payload);
      set((state) => ({
        reservations: [res.data, ...state.reservations],
        loading: false,
      }));
      toast.success("Reservation created successfully!");
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create reservation";
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
      const message = error.response?.data?.message || "Failed to update reservation";
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
      const message = error.response?.data?.message || "Failed to delete reservation";
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
