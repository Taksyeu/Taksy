'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { registerUser } from '@/lib/firebase/auth';

export function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setIsSubmitting(true);
      await registerUser({ fullName, email, password });

      setSuccess('Verification email sent');

      // Give the user a moment to see the message before redirecting.
      setTimeout(() => {
        router.push('/app/login');
      }, 1200);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-50">
      <div className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col justify-center px-4 py-12">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
          <p className="text-sm text-white/70">Register with your details, then verify your email.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-sm text-white/80">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-base text-white outline-none ring-offset-neutral-950 placeholder:text-white/30 focus:ring-2 focus:ring-white/20"
              placeholder="Jane Doe"
            />
          </div>

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
              autoComplete="new-password"
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

          {success ? (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {success}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-3 py-2 text-sm font-medium text-neutral-950 transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Creating account…' : 'Register'}
          </button>

          <div className="pt-1 text-center text-sm text-white/70">
            <span>Already have an account? </span>
            <Link
              href="/app/login"
              className="font-medium text-white underline underline-offset-4 hover:text-white/90"
            >
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
