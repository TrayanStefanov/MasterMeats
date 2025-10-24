import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  setProducts: (products) => set({ products, loading: false }),

  fetchAllProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/products");
      set({ products: res.data.products, loading: false });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({ loading: false, error: "Failed to fetch products" });
      toast.error(error.response?.data?.error || "Failed to fetch products");
    }
  },

  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
      toast.success("Product created!");
    } catch (error) {
      console.error("Error creating product:", error);
      set({ loading: false });
      toast.error(error.response?.data?.error || "Failed to create product");
    }
  },

  updateProduct: async (productId, updates) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/products/${productId}`, updates);
      set((prevState) => ({
        products: prevState.products.map((p) =>
          p._id === productId ? res.data : p
        ),
        loading: false,
      }));
      toast.success("Product updated!");
    } catch (error) {
      console.error("Error updating product:", error);
      set({ loading: false });
      toast.error(error.response?.data?.error || "Failed to update product");
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/products/${productId}`);
      set((prevState) => ({
        products: prevState.products.filter((p) => p._id !== productId),
        loading: false,
      }));
      toast.success("Product deleted!");
    } catch (error) {
      console.error("Error deleting product:", error);
      set({ loading: false });
      toast.error(error.response?.data?.error || "Failed to delete product");
    }
  },
}));
