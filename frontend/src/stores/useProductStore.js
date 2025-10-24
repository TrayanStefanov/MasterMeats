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

      const localizedProducts = backendProducts.map((p) => ({
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

      set({ products: localizedProducts, loading: false });
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
      const newProduct = res.data;

      const localizedProduct = {
        ...newProduct,
        title: i18next.t(`products.${newProduct.name}.title`, { defaultValue: newProduct.name }),
        description: i18next.t(`products.${newProduct.name}.description`, {
          defaultValue: newProduct.description || "",
        }),
        ingredients: i18next.t(`products.${newProduct.name}.ingredients`, {
          defaultValue: "",
        }),
        badge: i18next.t(`products.${newProduct.name}.badge`, { defaultValue: "" }),
      };

      set((prevState) => ({
        products: [...prevState.products, localizedProduct],
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
      const updatedProduct = res.data;

      const localizedProduct = {
        ...updatedProduct,
        title: i18next.t(`products.${updatedProduct.name}.title`, { defaultValue: updatedProduct.name }),
        description: i18next.t(`products.${updatedProduct.name}.description`, {
          defaultValue: updatedProduct.description || "",
        }),
        ingredients: i18next.t(`products.${updatedProduct.name}.ingredients`, {
          defaultValue: "",
        }),
        badge: i18next.t(`products.${updatedProduct.name}.badge`, { defaultValue: "" }),
      };

      set((prevState) => ({
        products: prevState.products.map((p) =>
          p._id === productId ? localizedProduct : p
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

      set((prev) => ({
        products: prev.products.filter((p) => p._id !== productId),
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

export default useProductStore;
