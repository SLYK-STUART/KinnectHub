import { create } from "zustand";

import { persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,

            accessToken: null,

            isAuthenticated: false,

            login: (userData, token) =>
                set({
                    user: userData,
                    accessToken: token,
                    isAuthenticated: true,
                }),

            logout: () =>
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: "auth-storage",
        }
    )
);

export default useAuthStore;