"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { otpSchema, userAuthSchema } from "@/lib/validations/auth"
import { useAuthStore } from "@/store/use-auth-store"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { OTPForm } from "@/components/otp-form"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"

export default function LoginForm() {
  const router = useRouter()
  const {
    initiateLogin,
    verifyOTP,
    resendOTP,
    fetchUserInfo,

    pendingOTPVerification,
    otpExpiresAt,
  } = useAuthStore()

  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [canResend, setCanResend] = useState(false)

  const form = useForm<z.infer<typeof userAuthSchema>>({
    resolver: zodResolver(userAuthSchema),
    defaultValues: { username: "", password: "" },
  })

  useEffect(() => {
    if (otpExpiresAt) {
      const interval = setInterval(() => {
        const remaining = Math.max(
          0,
          Math.floor((otpExpiresAt - Date.now()) / 1000)
        )
        setTimeLeft(remaining)
        setCanResend(remaining === 0)

        if (remaining === 0) {
          clearInterval(interval)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [otpExpiresAt])

  const handleLogin = useCallback(
    async (values: z.infer<typeof userAuthSchema>) => {
      setIsLoading(true)

      const username = values.username
      const password = values.password
      userAuthSchema.parse({ username, password })

      try {
        await initiateLogin(username, password)
        toast({
          title: "Sign in successful",
          description: "Please enter the OTP sent to your device.",
        })
      } catch {
        toast({
          title: "Sign in failed",
          description: "An error occurred during sign in.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [initiateLogin]
  )

  const handleOTPVerification = async (values: z.infer<typeof otpSchema>) => {
    const otp = values.otp

    if (otp.length !== 6) return

    setIsLoading(true)
    try {
      await verifyOTP(otp)
      await fetchUserInfo()
      toast({
        title: "OTP verification successful",
        description: "You are now logged in.",
      })
      router.push("/hssk/import")
    } catch {
      toast({
        title: "OTP verification failed",
        description: "An error occurred during OTP verification.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = useCallback(async () => {
    if (!canResend) return
    setIsLoading(true)

    try {
      resendOTP()
      toast({
        title: "OTP resent successfully",
        description: "Please enter the OTP sent to your device.",
      })
    } catch {
      toast({
        title: "Failed to resend OTP",
        description: "An error occurred during OTP resend.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [canResend, resendOTP])

  return (
    <Card className="mx-auto w-full max-w-[380px] border-none bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Đăng nhập</CardTitle>
        <CardDescription>
          Đăng nhập bằng tài khoản hồ sơ sức khỏe
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pendingOTPVerification ? (
          <OTPForm
            onSubmit={handleOTPVerification}
            isLoading={isLoading}
            onResend={handleResendOTP}
            canResend={canResend}
            timeLeft={timeLeft}
          />
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên đăng nhập của bạn"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu của bạn"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Đăng nhập
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
