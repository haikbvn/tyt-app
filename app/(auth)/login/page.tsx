"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuthStore } from "@/store/use-auth-store"
import LoginForm from "@/components/login-form"

export default function LoginPage() {
  const router = useRouter()
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    if (checkAuth()) {
      router.push("/")
    }
  }, [checkAuth, router])

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4">
      <LoginForm />
    </div>
  )
}
