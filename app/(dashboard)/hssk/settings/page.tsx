"use client";

import { useEffect, useState } from "react";
import { fetch } from "@tauri-apps/plugin-http";
import { ShieldCheck } from "lucide-react";

import { toast } from "@/hooks/use-toast";
import {
  OTPForm as OTPFormType,
  SigninForm as SigninFormType,
} from "@/lib/schemas";
import { useTokenStore } from "@/store/use-token-store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { OTPForm } from "@/components/otp-form";
import { PageHeader } from "@/components/page-header";
import { SigninForm } from "@/components/signin-form";

export default function HsskSettings() {
  const [step, setStep] = useState<"signin" | "otp" | "loggedIn">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setAccessToken, loadTokenFromStorage, isTokenValid, clearToken } =
    useTokenStore();

  // Check if token is valid on component mount
  useEffect(() => {
    loadTokenFromStorage();

    if (isTokenValid()) {
      setStep("loggedIn");
    } else {
      clearToken();
      setStep("signin");
    }
  }, [loadTokenFromStorage, isTokenValid, clearToken]);

  async function onSigninSubmit(values: SigninFormType) {
    setIsLoading(true);
    try {
      const encodedPassword = btoa(values.password); // Base64 encode the password
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/resource/authentication/signin_v2`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.username,
            password: encodedPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.status !== 200) {
        toast({
          title: "Sign in failed",
          description: data.message || "An error occurred during sign in.",
          variant: "destructive",
        });
      } else {
        setUsername(values.username);
        setPassword(encodedPassword);
        setStep("otp");
        toast({
          title: "Sign in successful",
          description: "Please enter the OTP sent to your device.",
        });
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "An error occurred during sign in.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onOtpSubmit(values: OTPFormType) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/resource/authentication/check-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            otp: values.otp,
            phoneNumber: null,
            captcha: null,
          }),
        }
      );

      const data = await response.json();

      if (response.status !== 200) {
        toast({
          title: "OTP verification failed",
          description:
            data.message || "An error occurred during OTP verification.",
          variant: "destructive",
        });
      } else {
        const accessToken = data.data.access_token;
        const expiresIn = data.data.expires_in; // expires_in is in seconds

        setAccessToken(accessToken, expiresIn); // Store token and expiration
        setStep("loggedIn");
        toast({
          title: "OTP verification successful",
          description: "You are now logged in.",
        });
      }
    } catch (error) {
      toast({
        title: "OTP verification failed",
        description: "An error occurred during OTP verification.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex max-w-2xl flex-col">
      <div className="space-y-6">
        <PageHeader
          title="HSSK Settings"
          description="A composable, themeable and customizable sidebar component."
        />
        {step === "signin" && (
          <SigninForm onSubmit={onSigninSubmit} isLoading={isLoading} />
        )}
        {step === "otp" && (
          <OTPForm onSubmit={onOtpSubmit} isLoading={isLoading} />
        )}
        {step === "loggedIn" && (
          <Alert className="text-green-600 [&>svg]:text-green-600">
            <ShieldCheck className="h-5 w-5" />
            <AlertTitle className="font-semibold">
              You are logged in!
            </AlertTitle>
            <AlertDescription>
              Welcome back, You have successfully signed in.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
