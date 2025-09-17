// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5002",
// });

// // Helper to set/remove auth token in headers
// export const setAuthToken = (token) => {
//   if (token) {
//     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete api.defaults.headers.common["Authorization"];
//   }
// };

// export const register = (data) => api.post("/api/auth/register", data);
// export const login = (data) => api.post("/api/auth/login", data);
// export const getMe = () => api.get("/api/auth/me");
// export const updateProfileApi = (data) => api.put("/api/auth/update", data);
// export const changePassword = (data) => api.put("/api/auth/change-password", data);

// export default api;


import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5002" || "https://sip-chill-1.onrender.com",
});

// Helper to set/remove auth token in headers
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Regular auth endpoints
export const register = (data) => api.post("/api/auth/register", data);
export const login = (data) => api.post("/api/auth/login", data);
export const getMe = () => api.get("/api/auth/me");
export const updateProfileApi = (data) => api.put("/api/auth/update", data);
export const changePassword = (data) => api.put("/api/auth/change-password", data);

// ✅ New: Google login
export const googleLogin = (token) => api.post("/api/auth/google", { token });

export default api;
