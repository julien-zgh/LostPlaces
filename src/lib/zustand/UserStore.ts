import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoggedUser } from "../type";



interface AuthState {
  user: LoggedUser | null;
  setUser: (user: LoggedUser) => void;
  clearUser: () => void;
  incrementPending: () => void;
}

export const useUserStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      incrementPending: () => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({
          user: {
            ...currentUser,
            pending: currentUser.pending + 1,
          },
        });
      },
    }),
    {
      name: "user-storage",
    }
  )
);
