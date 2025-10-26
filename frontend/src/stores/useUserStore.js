import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { useCartStore } from "../stores/useCartStore";

let refreshPromise = null;

export const useUserStore = create(
	persist(
		(set, get) => ({
			user: null,
			loading: false,
			checkingAuth: true,
			signup: async ({ name, email, password, confirmPassword }) => {
				set({ loading: true });
				if (password !== confirmPassword) {
					set({ loading: false });
					return toast.error("Passwords do not match");
				}

				try {
					const res = await axios.post("/auth/signup", { name, email, password });
					set({ user: res.data, loading: false });
					toast.success("Account created!");
				} catch (error) {
					set({ loading: false });
					toast.error(error.response?.data?.message || "An error occurred");
				}
			},
			login: async (email, password) => {
				set({ loading: true });
				try {
					const res = await axios.post("/auth/login", { email, password });

					set({ user: res.data, loading: false });
					toast.success("Logged in!");

					useCartStore.getState().getCartItems();
				} catch (error) {
					set({ loading: false });
					toast.error(error.response?.data?.message || "Login failed");
				}
			},

			/**
			 * 🚪 LOGOUT
			 */
			logout: async () => {
				try {
					await axios.post("/auth/logout");
					useCartStore.getState().clearCartFrontendOnly();
					set({ user: null });
					toast.success("Logged out");
				} catch (error) {
					toast.error(error.response?.data?.message || "Logout failed");
				}
			},

			checkAuth: async () => {
				set({ checkingAuth: true });
				try {
					const response = await axios.get("/auth/profile");
					set({ user: response.data, checkingAuth: false });

					// Sync cart from user’s data
					useCartStore.setState({
						cart: response.data.cartItems.map(item => ({
							...item.product,
							quantityInGrams: item.quantityInGrams,
						})),
					});
					useCartStore.getState().calculateTotals();
				} catch (error) {
					console.log("Auth check failed:", error.message);
					set({ user: null, checkingAuth: false });
				}
			},
			refreshToken: async () => {
				// Prevent multiple simultaneous refresh attempts
				if (get().checkingAuth) return;

				set({ checkingAuth: true });
				try {
					const response = await axios.post("/auth/refresh-token");
					set({ checkingAuth: false });
					return response.data;
				} catch (error) {
					console.warn("Refresh token failed:", error.message);
					set({ user: null, checkingAuth: false });
					throw error;
				}
			},
		}),
		{
			name: "user-store",
			partialize: (state) => ({
				user: state.user,
			}),
		}
	)
);

// Axios interceptor for token refresh

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				useCartStore.getState().clearCartFrontendOnly();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);