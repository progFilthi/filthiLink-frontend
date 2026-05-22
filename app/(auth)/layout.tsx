import Link from "next/link";
import Image from "next/image";
import { GoogleOAuthWrapper } from "@/components/providers/google-oauth-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthWrapper>
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/filthi-link-logo.png"
              alt="filthiLink Logo"
              width={28}
              height={28}
              className="rounded-md"
            />
            <span className="text-sm font-semibold tracking-tight">
              filthiLink
            </span>
          </Link>
        </div>

        <div className="relative w-full max-w-sm">{children}</div>

        <p className="relative mt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} filthiLink. All rights reserved.
        </p>
      </div>
    </GoogleOAuthWrapper>
  );
}
