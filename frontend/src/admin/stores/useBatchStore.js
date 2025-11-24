import { create } from "zustand";
import axios from "../../lib/axios.js";
import { toast } from "react-hot-toast";

export const useBatchStore = create((set, get) => ({
  batches: [],
  currentBatch: null,
  loading: false,
  error: null,

  apiCall: async (fn, successMsg = null, errorMsg = "Something went wrong") => {
    set({ loading: true, error: null });
    try {
      const res = await fn();
      if (successMsg) toast.success(successMsg);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || errorMsg;
      console.error("API Error:", err);
      set({ error: msg });
      toast.error(msg);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  fetchBatches: async () => {
    const data = await get().apiCall(
      () => axios.get("/batches"),
      null,
      "Failed to fetch batches"
    );
    set({ batches: data || [] });
  },

  fetchBatchById: async (id) => {
    const data = await get().apiCall(
      () => axios.get(`/batches/${id}`),
      null,
      "Failed to fetch batch"
    );
    set({ currentBatch: data });
    return data;
  },
  createBatch: async (data) => {
    const newBatch = await get().apiCall(
      () => axios.post("/batches", data),
      "Batch created successfully",
      "Failed to create batch"
    );

    set((state) => ({
      batches: [newBatch, ...state.batches],
      currentBatch: newBatch,
    }));

    return newBatch;
  },

  updatePhase: async (batchId, phase, data) => {
    const updatedBatch = await get().apiCall(
      () => axios.put(`/batches/${batchId}/${phase}`, data),
      `${phase} phase updated`,
      "Failed to update phase"
    );

    set((state) => ({
      currentBatch: state.currentBatch?._id === batchId ? updatedBatch : state.currentBatch,
      batches: state.batches.map((b) => (b._id === batchId ? updatedBatch : b)),
    }));

    return updatedBatch;
  },

  addEntry: async (batchId, phase, entry) => {
    const updatedBatch = await get().apiCall(
      () => axios.post(`/batches/${batchId}/${phase}`, entry),
      `${phase === "seasoning" ? "Seasoning" : "Vacuum"} entry added`,
      `Failed to add ${phase} entry`
    );

    set((state) => ({
      currentBatch: state.currentBatch?._id === batchId ? updatedBatch : state.currentBatch,
      batches: state.batches.map((b) => (b._id === batchId ? updatedBatch : b)),
    }));

    return updatedBatch;
  },
  finishBatch: async (batchId) => {
    const updatedBatch = await get().apiCall(
      () => axios.put(`/batches/${batchId}/finish`),
      "Batch marked as finished",
      "Failed to finish batch"
    );

    set((state) => ({
      currentBatch: state.currentBatch?._id === batchId ? updatedBatch : state.currentBatch,
      batches: state.batches.map((b) => (b._id === batchId ? updatedBatch : b)),
    }));

    return updatedBatch;
  },

  clearCurrentBatch: () => set({ currentBatch: null, error: null }),
}));
