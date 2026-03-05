import Link from 'next/link';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const nav = [
  { label: 'Home', href: '/app' },
  { label: 'Driver', href: '/app/driver' },
  { label: 'Customer', href: '/app/customer' },
  { label: 'Ride', href: '/app/ride' },
  { label: 'Settings', href: '/app/settings' },
  { label: 'Support', href: '/app/support' },
];

export default function PlatformProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-dvh bg-neutral-950 text-neutral-50">
        <header className="border-b border-white/10 bg-neutral-950">
          <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/app" className="text-base font-semibold tracking-tight">
              TAKSY Platform
            </Link>

            <nav className="hidden items-center gap-4 text-sm text-white/70 sm:flex">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">{children}</main>

        <footer className="border-t border-white/10 py-6 text-center text-xs text-white/50">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            Platform area (/app) — foundation only (no ride logic yet).
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
