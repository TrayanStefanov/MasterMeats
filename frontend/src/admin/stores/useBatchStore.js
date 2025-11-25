import { create } from "zustand";
import axios from "../../lib/axios.js";
import { toast } from "react-hot-toast";

const PHASE_NAMES = {
  sourcing: "Sourcing",
  prepping: "Prepping",
  curing: "Curing",
  seasoning: "Seasoning",
  vacuum: "Vacuum Sealing",
};

export const useBatchStore = create((set, get) => ({
  batches: [],
  currentBatch: null,
  loading: false,
  error: null,

  /* -----------------------------
   * Generic API call helper
   * ----------------------------- */
  apiCall: async (fn, successMsg = null, errorMsg = "Something went wrong") => {
    set({ loading: true, error: null });
    try {
      const res = await fn();
      if (successMsg) toast.success(successMsg);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || errorMsg;
      set({ error: msg });
      toast.error(msg);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /* -----------------------------
   * Fetch all batches
   * ----------------------------- */
  fetchBatches: async () => {
    const data = await get().apiCall(
      () => axios.get("/batches"),
      null,
      "Failed to fetch batches"
    );
    set({ batches: data || [] });
  },

  /* -----------------------------
   * Fetch a single batch by ID
   * ----------------------------- */
  fetchBatchById: async (id) => {
    const data = await get().apiCall(
      () => axios.get(`/batches/${id}`),
      null,
      "Failed to fetch batch"
    );
    set({ currentBatch: data });
    return data;
  },

  /* -----------------------------
   * Create a new batch
   * ----------------------------- */
  createBatch: async (batchData) => {
    const newBatch = await get().apiCall(
      () => axios.post("/batches", batchData),
      "Batch created successfully",
      "Failed to create batch"
    );

    set((state) => ({
      batches: [newBatch, ...state.batches],
      currentBatch: newBatch,
    }));

    return newBatch;
  },

  /* -----------------------------
   * Update a phase
   * ----------------------------- */
  updatePhase: async (batchId, phase, data) => {
    if (["seasoning", "vacuum"].includes(phase)) {
      throw new Error(
        `${PHASE_NAMES[phase]} is additive; use addPhaseEntry instead`
      );
    }

    const updatedBatch = await get().apiCall(
      () => axios.put(`/batches/${batchId}/${phase}`, data),
      `${PHASE_NAMES[phase] || phase} phase updated`,
      `Failed to update ${phase} phase`
    );

    set((state) => ({
      currentBatch: state.currentBatch?._id === batchId ? updatedBatch : state.currentBatch,
      batches: state.batches.map((b) => (b._id === batchId ? updatedBatch : b)),
    }));

    return updatedBatch;
  },

  /* -----------------------------
   * Add an entry to a phase (seasoning or vacuum)
   * ----------------------------- */
  addPhaseEntry: async (batchId, phase, data) => {
  if (!["seasoning", "vacuum"].includes(phase)) {
    throw new Error(`Invalid phase for entries: ${phase}`);
  }

  const payload = Array.isArray(data) ? { entries: data } : data;

  const updatedBatch = await get().apiCall(
    () => axios.post(`/batches/${batchId}/${phase}`, payload),
    `${PHASE_NAMES[phase]} entry added`,
    `Failed to add ${phase} entry`
  );

  set((state) => ({
    currentBatch: state.currentBatch?._id === batchId ? updatedBatch : state.currentBatch,
    batches: state.batches.map((b) => (b._id === batchId ? updatedBatch : b)),
  }));

  return updatedBatch;
},


  /* -----------------------------
   * Finish a batch
   * ----------------------------- */
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

  /* -----------------------------
   * Reset state
   * ----------------------------- */
  clearCurrentBatch: () => set({ currentBatch: null, error: null }),
}));
