import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
    console.log("Axios request URL:", config.baseURL + config.url);
    return config;
});

export default axiosInstance;