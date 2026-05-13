import { authApi } from "@/lib/api"
import { User } from "@/types"
import { create } from "zustand"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isInitialized: boolean

  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({

  user: null,
  isAuthenticated: false,
  isInitialized: false,

  initializeAuth: () => {

    const token = authApi.getToken()
    const user = authApi.getStoredUser()

    if (token && user) {
      set({
        user,
        isAuthenticated: true,
        isInitialized: true,
      })
    } else {
      set({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      })
    }
  },

  setAuth: (user, token) => {

    localStorage.setItem("mediq_token", token)
    localStorage.setItem("mediq_user", JSON.stringify(user))

    set({
      user,
      isAuthenticated: true,
      isInitialized: true,
    })
  },

  clearAuth: () => {

    authApi.logout()

    set({
      user: null,
      isAuthenticated: false,
      isInitialized: true,
    })
  },

}))