'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { useAuth } from '@/context/AuthContext';
import { loginUser } from '@/lib/firebase/auth';
import { getRoleHomePath } from '@/lib/roleRedirect';

export function LoginForm() {
  const router = useRouter();
  const { firebaseUser, platformUser, loading } = useAuth();

  // If the user is already signed in, don't show the login form — send them to their role area.
  React.useEffect(() => {
    if (loading) return;
    if (!firebaseUser) return;

    // Only redirect once the platform user doc has been loaded.
    // Otherwise we might route to /app (unknown role) and never recover.
    if (!platformUser) return;

    const target = getRoleHomePath(platformUser.role);
    router.replace(target);
  }, [firebaseUser, loading, platformUser, router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    try {
      setIsSubmitting(true);
      await loginUser(email, password);
      router.push('/app');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-50">
      <div className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col justify-center px-4 py-12">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-white/70">Sign in with your email and password.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm text-white/80">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-base text-white outline-none ring-offset-neutral-950 placeholder:text-white/30 focus:ring-2 focus:ring-white/20"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm text-white/80">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-base text-white outline-none ring-offset-neutral-950 placeholder:text-white/30 focus:ring-2 focus:ring-white/20"
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-3 py-2 text-sm font-medium text-neutral-950 transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Logging in…' : 'Login'}
          </button>

          <div className="pt-1 text-center text-sm text-white/70">
            <span>Don&apos;t have an account? </span>
            <Link
              href="/app/register"
              className="font-medium text-white underline underline-offset-4 hover:text-white/90"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
