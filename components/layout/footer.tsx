import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Image
              src="/filthi-link-logo.png"
              alt="filthiLink Logo"
              width={24}
              height={24}
              className="rounded-md"
            />
            <span className="text-sm font-medium text-foreground">filthiLink</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <Link href="#" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <a
              href="https://github.com/filthilink"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} filthiLink. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
