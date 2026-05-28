import axios from "axios";

import useAuthStore from "../store/auth.store";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use(
    (config) => {
        const token =
            useAuthStore.getState().accessToken;

            if (token) {
                config.headers.Authorization =
                    `Bearer ${token}`;
            }

            return config;
    },

    (error) => Promise.reject(error)
);

export default API;