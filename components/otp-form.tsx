"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { otpSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

interface OTPFormProps {
  onSubmit: (values: z.infer<typeof otpSchema>) => Promise<void>
  onResend?: () => Promise<void>
  onBack?: () => void
  canResend?: boolean
  timeLeft?: number
  isLoading: boolean
}

export function OTPForm({
  onSubmit,
  onResend,
  onBack,
  canResend = false,
  timeLeft = 0,
  isLoading,
}: OTPFormProps) {
  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Vui lòng nhập mã OTP đã được gửi tới số điện thoại của bạn.
              </FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup className="w-full *:flex-1">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className="text-sm text-muted-foreground">
          {canResend ? "Mã OTP đã hết hạn!" : `Mã OTP hết hạn sau ${timeLeft}s`}
        </p>

        <Button
          type={canResend ? "button" : "submit"}
          disabled={isLoading}
          onClick={canResend ? onResend : undefined}
          className="w-full"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {canResend ? "Gửi lại OTP" : "Xác nhận OTP"}
        </Button>

        <div className="flex flex-col items-center justify-stretch space-y-2">
          <p>Hoặc quay lại đăng nhập bằng tài khoản khác!</p>

          <Button
            type="button"
            disabled={isLoading}
            onClick={onBack}
            variant="ghost"
            className="w-full"
          >
            Back
          </Button>
        </div>
      </form>
    </Form>
  )
}
