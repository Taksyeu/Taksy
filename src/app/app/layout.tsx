import type { Metadata } from 'next';

import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'TAKSY Platform',
  description: 'TAKSY taxi platform (PWA) — platform area under /app.',
};

// Root /app layout:
// - Provides AuthProvider to all /app routes.
// - Does NOT enforce protection here so we can keep /app/login public.
export default function PlatformRootLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
