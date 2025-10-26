import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { useUserStore } from "./useUserStore";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,

  _requireAuth: () => {
    const { user } = useUserStore.getState();
    if (!user) {
      toast.error("You must be logged in to perform this action");
      return false;
    }
    return true;
  },

  getCartItems: async () => {
    if (!get()._requireAuth()) return;
    try {
      const res = await axios.get("/cart");
      const normalizedCart = res.data.map((item) => ({
        ...item,
        images: item.images?.map((img) =>
          typeof img === "string" ? img : img.url
        ) || [],
      }));

      set({ cart: normalizedCart });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(
        error.response?.data?.message || "Failed to fetch cart items"
      );
    }
  },

  getDistinctProductCount: () => get().cart.length,

  clearCartFrontendOnly: () => {
    if (!get()._requireAuth()) return;
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
    toast.success("Cart cleared locally");
  },

  clearCart: async () => {
    if (!get()._requireAuth()) return;

    try {
      await axios.delete("/cart");
      set({ cart: [], coupon: null, total: 0, subtotal: 0 });
      toast.success("Cart cleared");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear cart");
    }
  },

  addToCart: async (product, quantityInGrams = 500) => {
    if (!get()._requireAuth()) return;

    if (quantityInGrams < 500 || quantityInGrams % 100 !== 0) {
      toast.error("Minimum 500g, in 100g increments");
      return;
    }

    try {
      await axios.post("/cart", { productId: product._id, quantityInGrams });
      const normalizedImages = product.images?.map((img) =>
        typeof img === "string" ? img : img.url
      );

      toast.success(
        `${product.title} added (${(quantityInGrams / 1000).toFixed(1)}kg)`
      );

      set((prev) => {
        const existing = prev.cart.find((item) => item._id === product._id);
        const newCart = existing
          ? prev.cart.map((item) =>
              item._id === product._id
                ? {
                    ...item,
                    quantityInGrams: item.quantityInGrams + quantityInGrams,
                  }
                : item
            )
          : [
              ...prev.cart,
              {
                ...product,
                images: normalizedImages,
                quantityInGrams,
              },
            ];

        return { cart: newCart };
      });

      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  },

  removeFromCart: async (productId) => {
    if (!get()._requireAuth()) return;

    try {
      await axios.delete("/cart", { data: { productId } });
      set((prev) => ({
        cart: prev.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
      toast.success("Removed from cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  },

  updateQuantity: async (productId, quantityInGrams) => {
    if (!get()._requireAuth()) return;

    if (quantityInGrams < 500 || quantityInGrams % 100 !== 0) {
      toast.error("Minimum 500g, in 100g increments");
      return;
    }

    try {
      await axios.put(`/cart/${productId}`, { quantityInGrams });
      set((prev) => ({
        cart: prev.cart.map((item) =>
          item._id === productId ? { ...item, quantityInGrams } : item
        ),
      }));
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  },

  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + (item.pricePerKg * item.quantityInGrams) / 1000,0);
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },
}));

export default useCartStore;
