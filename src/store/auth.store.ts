import { create } from "zustand";
import type { AuthStoreState } from "../types/store.type";
import { devtools } from "zustand/middleware";

export const useAuthStore = create<AuthStoreState>()(
  devtools((set, get) => ({
    user: null,
    setUser: (user) =>
      set({
        user,
      }),
    removeUser: () => set({ user: null }),
    hasUser: () => get().user !== null,
  }))
);
