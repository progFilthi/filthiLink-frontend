"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { AuthService } from "@/lib/api/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function GoogleLoginButton() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google login failed. No credential received.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await AuthService.googleLogin({
        idToken: credentialResponse.credential,
      });

      if (response.accessToken && response.email) {
        setAuth(response.accessToken, response.refreshToken, response.email);
        toast.success("Signed in with Google.");
        router.push("/dashboard");
      }
    } catch {
      toast.error("Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className="relative w-full">
      <div
        className="flex items-center justify-center gap-3 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium text-foreground"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </div>

      {isLoading && (
        <LoadingSpinner className="absolute right-3 top-1/2 -translate-y-1/2 text-primary" />
      )}

      <div className="absolute inset-0 overflow-hidden opacity-[0.01] [&>div]:min-h-full [&>div]:min-w-full">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          theme="outline"
          size="large"
          shape="rectangular"
          width="100%"
          text="continue_with"
          logo_alignment="center"
        />
      </div>
    </div>
  );
}
