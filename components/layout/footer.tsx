import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <Image
              src="/filthi-link-logo.png"
              alt="filthiLink Logo"
              width={24}
              height={24}
              className="rounded-md"
            />
            <span className="text-sm font-semibold">filthiLink</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <a
              href="https://docs.filthilink.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Docs
            </a>
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

        <div className="mt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} filthiLink. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
