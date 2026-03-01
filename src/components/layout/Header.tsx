import Link from 'next/link';

import { Button } from '@/components/ui/Button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/taksy-logo.svg"
            alt="TAKSY"
            width={100}
            style={{ width: 100, height: 'auto' }}
            className="block"
            loading="eager"
            decoding="async"
          />
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-black/70 sm:flex">
          <a className="transition-colors hover:text-black" href="#top">
            Home
          </a>
          <a className="transition-colors hover:text-black" href="#how-it-works">
            Functies
          </a>
          <a className="transition-colors hover:text-black" href="#calculator">
            Portfolio
          </a>
          <a className="transition-colors hover:text-black" href="#sponsors">
            Sponsor
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
