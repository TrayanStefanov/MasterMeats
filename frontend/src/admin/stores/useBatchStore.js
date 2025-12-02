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

// Helper: sanitize numeric fields
const sanitizePhaseData = (data) =>
  Object.fromEntries(
    Object.entries(data).map(([k, v]) => [
      k,
      v === "" ? 0 : !isNaN(v) ? Number(v) : v,
    ])
  );

// Helper: filter out empty/incomplete entries for array-based phases
const filterValidEntries = (phase, entries) => {
  if (!entries || !entries.length) return [];
  return entries.filter((e) => {
    if (phase === "seasoning") {
      return (e.spiceId || e.spiceMixId) && Number(e.cuts) > 0 && Number(e.spiceAmountUsedInGrams) > 0;
    }
    if (phase === "vacuum") {
      return Number(e.vacuumedSlices) > 0 || Number(e.driedKg) > 0;
    }
    return true; // for single-object phases, keep everything
  });
};

export const useBatchStore = create((set, get) => ({
  batches: [],
  currentBatch: null,
  loading: false,
  error: null,

  // Generic API helper
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

  fetchBatches: async () => {
    const data = await get().apiCall(() => axios.get("/batches"), null, "Failed to fetch batches");
    set({ batches: data || [] });
  },

  fetchBatchById: async (id) => {
    const data = await get().apiCall(() => axios.get(`/batches/${id}`), null, "Failed to fetch batch");
    set({ currentBatch: data });
    return data;
  },

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

  // ---------------- Phase Update ----------------
  updatePhase: async (batchId, phase, data) => {
    // Sanitize numeric fields
    console.log("data", data);
    data = sanitizePhaseData(data);

    // If phase has entries array, filter out incomplete entries
    if (phase === "seasoning" || phase === "vacuum") {
      data.entries = filterValidEntries(phase, data.entries);
    }
    console.log("phase", phase);

    console.log("data", data);
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

  setCurrentBatch: (batch) => set({ currentBatch: batch }),
  clearCurrentBatch: () => set({ currentBatch: null, error: null }),
}));
