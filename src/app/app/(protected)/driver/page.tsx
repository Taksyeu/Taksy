'use client';

import * as React from 'react';

import { subscribeToRequestedRides, type RideRequest } from '@/lib/firebase/ridesFeed';

export default function DriverPage() {
  const [rides, setRides] = React.useState<RideRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);

    let unsub: (() => void) | null = null;

    try {
      unsub = subscribeToRequestedRides(
        (next) => {
          setRides(next);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load ride requests.';
      setError(message);
      setLoading(false);
    }

    return () => {
      unsub?.();
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-[720px] space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Driver Dashboard</h1>
        <p className="text-sm text-white/60">Live feed of requested rides (UI only for accepting).</p>
      </header>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white/90">Ride Requests</h2>

        {loading ? <div className="text-sm text-white/60">Loading…</div> : null}

        {!loading && rides.length === 0 ? <div className="text-sm text-white/60">No requests right now.</div> : null}

        <div className="grid gap-3">
          {rides.map((ride) => (
            <div key={ride.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="grid gap-2 sm:grid-cols-3">
                <div>
                  <div className="text-xs font-medium text-white/60">Pickup</div>
                  <div className="text-sm text-white/90">{ride.pickupLocation || '—'}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-white/60">Destination</div>
                  <div className="text-sm text-white/90">{ride.destination || '—'}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-white/60">Status</div>
                  <div className="text-sm text-white/90">{ride.status || '—'}</div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
                >
                  Accept Ride
                </button>
                <p className="mt-2 text-xs text-white/50">Button is UI-only for now (no matching/assignment yet).</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
