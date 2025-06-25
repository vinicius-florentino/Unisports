import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const tokenStorage = localStorage.getItem("token") || null;

        if (tokenStorage) {
            config.headers.Authorization = `Bearer ${tokenStorage.replace(/"/g, '')}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toast.error("Não autorizado, faça login novamente caso necessário.");
            setTimeout(() => {
                window.location.href = "/";
            }, 5000);   
        }
        return Promise.reject(error);
    }
);

export default api;
