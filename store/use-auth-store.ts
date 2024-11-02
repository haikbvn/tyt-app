// import { fetch } from "@tauri-apps/plugin-http"
import * as z from "zod"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { authStateSchema } from "@/lib/validations/auth"
import { userInfoSchema } from "@/lib/validations/user"

const API_URL = process.env.NEXT_PUBLIC_BASE_URL
const OTP_TIMEOUT = 90

interface AuthStoreState extends z.infer<typeof authStateSchema> {
  initiateLogin: (username: string, password: string) => Promise<void>
  verifyOTP: (otp: string) => Promise<void>
  resendOTP: () => Promise<void>
  fetchUserInfo: () => Promise<void>
  logout: () => void
  checkAuth: () => boolean
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      token: null,
      tokenExpiresAt: null,
      isAuthenticated: false,
      pendingOTPVerification: false,
      otpExpiresAt: null,
      userInfo: null,
      tempLoginData: null,

      initiateLogin: async (username: string, password: string) => {
        try {
          const encodedPassword = btoa(password)
          const response = await fetch(
            `${API_URL}/api/v1/resource/authentication/signin_v2`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, password: encodedPassword }),
            }
          )

          if (!response.ok) {
            throw new Error("Login failed")
          }

          set({
            pendingOTPVerification: true,
            otpExpiresAt: Date.now() + OTP_TIMEOUT * 1000,
            tempLoginData: {
              username,
              password: encodedPassword,
            },
          })
        } catch (error) {
          set({
            pendingOTPVerification: false,
            otpExpiresAt: null,
            tempLoginData: null,
          })
          throw error
        }
      },

      verifyOTP: async (otp: string) => {
        const tempData = get().tempLoginData

        if (!tempData) {
          throw new Error("No pending OTP verification")
        }

        try {
          const response = await fetch(
            `${API_URL}/api/v1/resource/authentication/check-otp`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: tempData.username,
                password: tempData.password,
                phoneNumber: null,
                captcha: null,
                otp,
              }),
            }
          )

          if (!response.ok) {
            throw new Error("OTP verification failed")
          }

          const data = await response.json()

          set({
            token: data.data.access_token,
            tokenExpiresAt: Date.now() + data.data.expires_in * 1000,
            isAuthenticated: true,
            pendingOTPVerification: false,
            otpExpiresAt: null,
            tempLoginData: null,
          })
        } catch (error) {
          throw error
        }
      },

      resendOTP: async () => {
        const tempData = get().tempLoginData

        if (!tempData) {
          throw new Error("No active session")
        }

        try {
          const response = await fetch(
            `${API_URL}/api/v1/resource/authentication/send-otp`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: tempData.username,
                password: tempData.password,
                phoneNumber: null,
                captcha: null,
                otp: null,
              }),
            }
          )

          if (!response.ok) {
            throw new Error("Failed to resend OTP")
          }

          set({ otpExpiresAt: Date.now() + OTP_TIMEOUT * 1000 })
        } catch (error) {
          throw error
        }
      },

      fetchUserInfo: async () => {
        const token = get().token

        if (!token) {
          throw new Error("No token available")
        }

        try {
          const response = await fetch(
            `${API_URL}/api/v1/resource/profile/get-detail`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )

          if (!response.ok) {
            throw new Error("Failed to fetch user info")
          }

          const data = await response.json()

          const userInfo: z.infer<typeof userInfoSchema> = {
            ...data.data.detail,
            healthfacilities: data.data.healthfacilities,
          }

          set({
            userInfo,
          })
        } catch (error) {
          throw error
        }
      },

      logout: () => {
        set({
          token: null,
          tokenExpiresAt: null,
          userInfo: null,
          isAuthenticated: false,
          pendingOTPVerification: false,
          otpExpiresAt: null,
          tempLoginData: null,
        })
      },

      checkAuth: () => {
        const { token, tokenExpiresAt } = get()

        if (!token || !tokenExpiresAt) {
          return false
        }

        const isValid = Date.now() < tokenExpiresAt

        if (!isValid) {
          get().logout()
        }

        return isValid
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
