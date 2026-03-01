'use client';

import * as React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';

const navItems = [
  { label: 'Home', href: '#top' },
  { label: 'Functies', href: '#how-it-works' },
  { label: 'Portfolio', href: '#calculator' },
  { label: 'Sponsor', href: '#sponsors' },
];

export function Header() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white sm:bg-white/80 sm:backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-[18px] font-bold text-[#000000]">
          Taksy
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-black/70 sm:flex">
          {navItems.map((item) => (
            <a key={item.href} className="transition-colors hover:text-black" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Desktop auth buttons (never show on mobile) */}
          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="secondary" href="#cta">
              Login
            </Button>
            <Button href="#cta">Register</Button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-black/70 shadow-sm transition-colors hover:text-black sm:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d={open ? 'M6 6L18 18M18 6L6 18' : 'M4 7H20M4 12H20M4 17H20'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open ? (
        <div
          id="mobile-nav"
          className="sm:hidden"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div className="mx-auto w-full max-w-[1200px] px-4 pb-4 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-black/10 bg-white p-3 shadow-sm">
              <div className="flex flex-col gap-1 text-sm text-black/70">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-3 py-2 transition-colors hover:bg-black/5 hover:text-black"
                  >
                    {item.label}
                  </a>
                ))}

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button variant="secondary" href="#cta" className="w-full justify-center">
                    Login
                  </Button>
                  <Button href="#cta" className="w-full justify-center">
                    Register
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
