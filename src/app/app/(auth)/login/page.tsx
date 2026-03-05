'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-50">
      <div className="mx-auto w-full max-w-[420px] px-4 py-12">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-white/70">
            Login UI is not implemented yet. This page exists so /app can be protected without
            returning a 404.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          Next steps: we’ll add an email/password form wired to Firebase Auth.
        </div>

        <div className="mt-6">
          <Link className="text-sm text-white underline underline-offset-4" href="/">
            ← Back to sponsor site
          </Link>
        </div>
      </div>
    </div>
  );
}
