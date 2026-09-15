import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically inject JWT Bearer token into every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("pt_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
