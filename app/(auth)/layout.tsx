import Link from 'next/link';
import Image from 'next/image';
import { GoogleOAuthWrapper } from '@/components/providers/google-oauth-provider';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthWrapper>
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
        {/* Brand */}
        <Link href="/" className="mb-8 flex items-center gap-2">
          <Image src="/filthi-link-logo.png" alt="filthiLink Logo" width={32} height={32} className="rounded-lg" />
          <span className="text-lg font-semibold tracking-tight">filthiLink</span>
        </Link>

        <div className="w-full max-w-sm">{children}</div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} filthiLink. All rights reserved.
        </p>
      </div>
    </GoogleOAuthWrapper>
  );
}
