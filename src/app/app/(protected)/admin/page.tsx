'use client';

import * as React from 'react';

import {
  approveDriver,
  rejectDriver,
  subscribeToDriverApplications,
  type DriverApplication,
} from '@/lib/firebase/adminDriverApplications';

export default function AdminPage() {
  const [apps, setApps] = React.useState<DriverApplication[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [actingUid, setActingUid] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);

    let unsub: (() => void) | null = null;

    try {
      unsub = subscribeToDriverApplications(
        (next) => {
          setApps(next);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load driver applications.';
      setError(message);
      setLoading(false);
    }

    return () => {
      unsub?.();
    };
  }, []);

  const formatCreatedAt = React.useCallback((createdAt: DriverApplication['createdAt']) => {
    if (!createdAt) return '—';
    const date = createdAt.toDate();
    return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }, []);

  async function onApprove(uid: string) {
    setError(null);
    try {
      setActingUid(uid);
      await approveDriver(uid);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to approve driver.';
      setError(message);
    } finally {
      setActingUid(null);
    }
  }

  async function onReject(uid: string) {
    setError(null);
    try {
      setActingUid(uid);
      await rejectDriver(uid);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reject driver.';
      setError(message);
    } finally {
      setActingUid(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[900px] space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-white/60">Manage pending driver applications.</p>
      </header>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-white/90">Driver Applications</h2>
        </div>

        {loading ? <div className="text-sm text-white/60">Loading…</div> : null}

        {!loading && apps.length === 0 ? (
          <div className="text-sm text-white/60">No pending applications.</div>
        ) : null}

        <div className="space-y-3">
          {apps.map((app) => (
            <div key={app.uid} className="rounded-xl border border-white/10 bg-neutral-950/40 p-3">
              <div className="grid gap-2 sm:grid-cols-3">
                <div>
                  <div className="text-[11px] font-medium text-white/60">Full name</div>
                  <div className="text-sm text-white/90">{app.fullName || '—'}</div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-white/60">Email</div>
                  <div className="text-sm text-white/90">{app.email || '—'}</div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-white/60">Created</div>
                  <div className="text-sm text-white/90">{formatCreatedAt(app.createdAt)}</div>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => onApprove(app.uid)}
                  disabled={actingUid === app.uid}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {actingUid === app.uid ? 'Working…' : 'Approve'}
                </button>
                <button
                  type="button"
                  onClick={() => onReject(app.uid)}
                  disabled={actingUid === app.uid}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {actingUid === app.uid ? 'Working…' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
