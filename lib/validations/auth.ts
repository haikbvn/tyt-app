import { z } from "zod"

import { userInfoSchema } from "@/lib/validations/user"

export const userAuthSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 characters"),
})

export const authStateSchema = z.object({
  token: z.string().nullable(),
  tokenExpiresAt: z.number().nullable(),
  isAuthenticated: z.boolean(),
  pendingOTPVerification: z.boolean(),
  otpExpiresAt: z.number().nullable(),
  userInfo: userInfoSchema.nullable(),
  tempLoginData: z
    .object({
      username: z.string(),
      password: z.string(),
    })
    .nullable(),
})
