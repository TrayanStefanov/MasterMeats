import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import i18next from "i18next";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  setProducts: (products) => set({ products, loading: false }),

  fetchAllProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/products");
      const backendProducts = res.data.products || res.data;

      const localized = backendProducts.map((p) => ({
        ...p,
        title: i18next.t(`products.${p.name}.title`, { defaultValue: p.name }),
        description: i18next.t(`products.${p.name}.description`, {
          defaultValue: p.description || "",
        }),
        ingredients: i18next.t(`products.${p.name}.ingredients`, {
          defaultValue: "",
        }),
        badge: i18next.t(`products.${p.name}.badge`, { defaultValue: "" }),
      }));

      set({ products: localized, loading: false });
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
      set({ loading: false, error: error.message });
    }
  },

  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/products", productData);
      const newProduct = res.data;
      toast.success("Product created!");

      set((prevState) => ({
        products: [...prevState.products, newProduct],
        loading: false,
      }));
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error.response?.data?.message || "Failed to create product");
      set({ loading: false, error: error.message });
    }
  },

  updateProduct: async (productId, updates) => {
    set({ loading: true, error: null });
    try {
      const payload = { ...updates };
      if (!payload.images?.length) delete payload.images;

      const res = await axios.put(`/products/${productId}`, payload);
      const updatedProduct = res.data;

      set((prevState) => ({
        products: prevState.products.map((p) => (p._id === productId ? updatedProduct : p)),
        loading: false,
      }));

      toast.success("Product updated!");
    } catch (error) {
      console.error("Error updating product:", error);
      set({ loading: false, error: error.message });
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((prev) => ({
        products: prev.products.filter((p) => p._id !== productId),
        loading: false,
      }));
      toast.success("Product deleted!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
      set({ loading: false, error: error.message });
    }
  },
}));
