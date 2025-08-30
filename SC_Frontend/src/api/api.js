import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5002",
});

// Add a request interceptor to include token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sipAndChillToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
