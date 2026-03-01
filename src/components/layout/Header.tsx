import Link from 'next/link';

import { Button } from '@/components/ui/Button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold tracking-wide text-black">
          TAKSY
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-black/70 sm:flex">
          <a className="hover:text-black transition-colors" href="#how-it-works">
            How it works
          </a>
          <a className="hover:text-black transition-colors" href="#calculator">
            Fare demo
          </a>
          <a className="hover:text-black transition-colors" href="#sponsors">
            Sponsors
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="secondary" className="hidden sm:inline-flex" href="#cta">
            Login
          </Button>
          <Button className="hidden sm:inline-flex" href="#cta">
            Register
          </Button>
          <Button
            variant="secondary"
            className="sm:hidden"
            href="#cta"
            aria-label="Open login/register"
          >
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}
