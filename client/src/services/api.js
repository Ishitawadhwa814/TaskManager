import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

if (!import.meta.env.VITE_API_URL && typeof window !== "undefined" && window.location.hostname !== "localhost") {
    console.warn("VITE_API_URL is not set in production. Frontend will use the same origin /api path.");
}

const API = axios.create({
    baseURL
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if (token) {
        req.headers.Authorization = token;
    }

    return req;
});

export default API;
