"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/lib/api/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { IconMail, IconLock, IconArrowRight } from "@tabler/icons-react";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await AuthService.register({ email, password });
      if (response.accessToken && response.email) {
        setAuth(response.accessToken, response.refreshToken, response.email);
        toast.success("Account created successfully.");
        router.push("/dashboard");
      }
    } catch {
      toast.error("Registration failed. Email may already be in use.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Create an account</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Get started with filthiLink for free
        </p>
      </div>

      <GoogleLoginButton />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">
            or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <div className="relative">
            <IconMail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-10 pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <div className="relative">
            <IconLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="register-password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="h-10 pl-9"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="h-10 w-full gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
          ) : (
            <>
              Create account
              <IconArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground transition-colors hover:text-primary"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
