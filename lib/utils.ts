import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isTokenExpired(): boolean {
  const expiresAt = localStorage.getItem("expires_at")
  if (!expiresAt) return true

  const expirationTime = parseInt(expiresAt)
  if (isNaN(expirationTime)) return true

  return Date.now() > expirationTime
}
