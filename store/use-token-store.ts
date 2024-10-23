import { create } from "zustand"
import { persist, PersistStorage } from "zustand/middleware"

// Định nghĩa kiểu cho store
interface TokenStore {
  token: string | null
  expiresAt: number | null
  setAccessToken: (token: string, expiresIn: number) => void
  isTokenValid: () => boolean
  loadTokenFromStorage: () => string | null
  clearToken: () => void
}

const customStorage: PersistStorage<TokenStore> = {
  getItem: (key) => {
    const value = localStorage.getItem(key)
    if (value === null) {
      return null
    }
    try {
      return JSON.parse(value)
    } catch (error) {
      console.error("Error parsing stored value:", error)
      return null
    }
  },
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  },
  removeItem: (key) => {
    localStorage.removeItem(key)
  },
}

// Tạo Zustand store với persist
export const useTokenStore = create<TokenStore>()(
  persist(
    (set, get) => ({
      token: null,
      expiresAt: null,
      setAccessToken: (token: string, expiresIn: number) => {
        const expiresAt = Date.now() + expiresIn * 1000 // Lưu thời gian hết hạn
        set({ token, expiresAt })
      },
      isTokenValid: () => {
        const { token, expiresAt } = get()
        return token !== null && expiresAt !== null && expiresAt > Date.now()
      },
      loadTokenFromStorage: () => {
        const { token, isTokenValid } = get()
        return isTokenValid() ? token : null
      },
      clearToken: () => set({ token: null, expiresAt: null }),
    }),
    {
      name: "auth-storage", // Tên key trong localStorage
      storage: customStorage, // Sử dụng localStorage
    }
  )
)
