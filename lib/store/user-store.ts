
// lib/auth/store/user-store.ts

import { create } from "zustand"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "user"
}

interface UserStore {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => set({ user: null }),
}))
