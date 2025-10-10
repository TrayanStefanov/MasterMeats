import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    isCouponApplied: false,

    getCartItems: async () => {
        try {
            const res = await axios.get("/cart");
            set({ cart: res.data });
            get().calculateTotals();
        } catch (error) {
            set({ cart: [] });
            toast.error(error.response.data.message || "Failed to fetch cart items");
        }
    },

    getCartCount: () => {
        const { cart } = get();
        return cart.reduce((sum, item) => sum + item.quantityInGrams, 0);
    },
    clearCartFrontendOnly: () => {
        set({ cart: [], coupon: null, total: 0, subtotal: 0 });
        toast.success("Cart cleared locally");
    },
    clearCart: async () => {
        try {
            await axios.delete("/cart");
            set({ cart: [], coupon: null, total: 0, subtotal: 0 });
            toast.success("Cart cleared");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to clear cart");
        }
    },
    addToCart: async (product, quantityInGrams = 500) => {
        if (quantityInGrams < 500 || quantityInGrams % 100 !== 0) {
            toast.error("Minimum 500g, in 100g increments");
            return;
        }
        try {
            await axios.post("/cart", { productId: product._id, quantityInGrams });
            toast.success("Product added to cart");

            set((prev) => {
                const existing = prev.cart.find((item) => item._id === product._id);
                const newCart = existing
                    ? prev.cart.map((item) =>
                        item._id === product._id
                            ? { ...item, quantityInGrams: item.quantityInGrams + quantityInGrams }
                            : item
                    )
                    : [...prev.cart, { ...product, quantityInGrams }];
                return { cart: newCart };
            });

            get().calculateTotals();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add to cart");
        }
    },
    removeFromCart: async (productId) => {
        try {
            await axios.delete("/cart", { data: { productId } }); // same as before
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
        // subtotal in terms of kg: price * quantity in grams / 1000
        const subtotal = cart.reduce((sum, item) => sum + (item.pricePerKg * item.quantityInGrams) / 1000, 0);
        let total = subtotal;

        if (coupon) {
            const discount = subtotal * (coupon.discountPercentage / 100);
            total = subtotal - discount;
        }

        set({ subtotal, total });
    },
}));