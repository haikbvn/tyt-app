import * as z from "zod"

export const signinSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 characters"),
})

export const excelSchema = z.object({
  filePath: z.string().min(1, "File path is required"),
  startRow: z.number().min(1, "Start row must be at least 1"),
  endRow: z.number().min(1, "End row must be at least 1"),
})

export type SigninForm = z.infer<typeof signinSchema>
export type OTPForm = z.infer<typeof otpSchema>
export type ExcelForm = z.infer<typeof excelSchema>
