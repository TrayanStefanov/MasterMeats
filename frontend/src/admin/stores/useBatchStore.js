import { create } from "zustand";
import axios from "../../lib/axios.js";
import { toast } from "react-hot-toast";

export const useBatchStore = create((set, get) => ({
  batches: [],
  currentBatch: null,
  loading: false,
  error: null,

  fetchBatches: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/batches");
      set({ batches: res.data || [], loading: false });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch batches";
      set({ loading: false, error: msg });
      toast.error(msg);
    }
  },

  fetchBatchById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/batches/${id}`);
      set({ currentBatch: res.data, loading: false });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch batch";
      set({ loading: false, error: msg });
      toast.error(msg);
    }
  },

  createBatch: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/batches", data);

      set((state) => ({
        batches: [res.data, ...state.batches],
        currentBatch: res.data,
        loading: false,
      }));

      toast.success("Batch created successfully");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create batch";
      set({ loading: false, error: msg });
      toast.error(msg);
      throw err;
    }
  },

  updatePhase: async (batchId, phase, data) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/batches/${batchId}/${phase}`, data);

      set((state) => ({
        currentBatch:
          state.currentBatch?._id === batchId ? res.data : state.currentBatch,
        batches: state.batches.map((b) => (b._id === batchId ? res.data : b)),
        loading: false,
      }));

      toast.success(`${phase} phase updated`);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update phase";
      set({ loading: false, error: msg });
      toast.error(msg);
      throw err;
    }
  },

  addSeasoningEntry: async (batchId, entry) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`/batches/${batchId}/seasoning`, entry);

      set((state) => ({
        currentBatch:
          state.currentBatch?._id === batchId ? res.data : state.currentBatch,
        batches: state.batches.map((b) => (b._id === batchId ? res.data : b)),
        loading: false,
      }));

      toast.success("Seasoning entry added");
      return res.data;
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to add seasoning entry";
      set({ loading: false, error: msg });
      toast.error(msg);
      throw err;
    }
  },

  addVacuumEntry: async (batchId, entry) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`/batches/${batchId}/vacuum`, entry);

      set((state) => ({
        currentBatch:
          state.currentBatch?._id === batchId ? res.data : state.currentBatch,
        batches: state.batches.map((b) => (b._id === batchId ? res.data : b)),
        loading: false,
      }));

      toast.success("Vacuum sealing entry added");
      return res.data;
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to add vacuum entry";
      set({ loading: false, error: msg });
      toast.error(msg);
      throw err;
    }
  },

  finishBatch: async (batchId) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/batches/${batchId}/finish`);

      set((state) => ({
        currentBatch:
          state.currentBatch?._id === batchId ? res.data : state.currentBatch,
        batches: state.batches.map((b) => (b._id === batchId ? res.data : b)),
        loading: false,
      }));

      toast.success("Batch marked as finished");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to finish batch";
      set({ loading: false, error: msg });
      toast.error(msg);
      throw err;
    }
  },

  clearCurrentBatch: () => set({ currentBatch: null }),
}));
