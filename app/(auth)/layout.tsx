import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      {/* Brand */}
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
          <span className="text-sm font-bold text-background">fL</span>
        </div>
        <span className="text-lg font-semibold tracking-tight">filthiLink</span>
      </Link>

      <div className="w-full max-w-sm">{children}</div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} filthiLink. All rights reserved.
      </p>
    </div>
  );
}
