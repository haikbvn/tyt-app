"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuthStore } from "@/store/use-auth-store"

export function AuthProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { checkAuth, logout } = useAuthStore()

  useEffect(() => {
    if (!checkAuth()) {
      logout()
      router.replace("/login")
    }
  }, [checkAuth, logout, router])

  return <>{children}</>
}
