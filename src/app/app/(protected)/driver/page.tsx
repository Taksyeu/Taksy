'use client';

import * as React from 'react';

import { useAuth } from '@/context/AuthContext';
import { acceptRide, startRide } from '@/lib/firebase/ridesActions';
import {
  subscribeToDriverActiveRide,
  subscribeToRequestedRides,
  type RideRequest,
} from '@/lib/firebase/ridesFeed';

export default function DriverPage() {
  const { firebaseUser, loading: authLoading } = useAuth();

  const [activeRide, setActiveRide] = React.useState<RideRequest | null>(null);
  const [rides, setRides] = React.useState<RideRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [acceptingRideId, setAcceptingRideId] = React.useState<string | null>(null);
  const [startingRideId, setStartingRideId] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Wait for auth resolution so we have the driver's uid.
    if (authLoading) return;

    setLoading(true);
    setError(null);

    if (!firebaseUser) {
      setActiveRide(null);
      setRides([]);
      setLoading(false);
      return;
    }

    let unsubActive: (() => void) | null = null;
    let unsubRequested: (() => void) | null = null;

    try {
      unsubActive = subscribeToDriverActiveRide(
        firebaseUser.uid,
        (ride) => {
          setActiveRide(ride);

          if (ride) {
            // Driver has an active ride; stop listening to the requested feed.
            unsubRequested?.();
            unsubRequested = null;
            setRides([]);
            setLoading(false);
            return;
          }

          // No active ride; ensure requested feed is subscribed.
          if (!unsubRequested) {
            unsubRequested = subscribeToRequestedRides(
              (next) => {
                setRides(next);
                setLoading(false);
              },
              (err) => {
                setError(err.message);
                setLoading(false);
              }
            );
          }
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load driver dashboard.';
      setError(message);
      setLoading(false);
    }

    return () => {
      unsubActive?.();
      unsubRequested?.();
    };
  }, [authLoading, firebaseUser]);

  async function onAcceptRide(rideId: string) {
    setError(null);
    setSuccess(null);

    if (!firebaseUser) {
      setError('You must be logged in to accept a ride.');
      return;
    }

    try {
      setAcceptingRideId(rideId);
      await acceptRide(rideId, firebaseUser.uid);
      setSuccess('Ride accepted.');
      // Ride will automatically disappear from the list because the feed filters REQUESTED.
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to accept ride.';
      setError(message);
    } finally {
      setAcceptingRideId(null);
    }
  }

  async function onStartRide(rideId: string) {
    setError(null);
    setSuccess(null);

    if (!firebaseUser) {
      setError('You must be logged in to start a ride.');
      return;
    }

    try {
      setStartingRideId(rideId);
      await startRide(rideId);
      // UI updates via onSnapshot.
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start ride.';
      setError(message);
    } finally {
      setStartingRideId(null);
    }
  }

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

      {success ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          {success}
        </div>
      ) : null}

      {activeRide ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-white/90">Active Ride</h2>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <div className="text-xs font-medium text-white/60">Pickup</div>
                <div className="text-sm text-white/90">{activeRide.pickupLocation || '—'}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-white/60">Destination</div>
                <div className="text-sm text-white/90">{activeRide.destination || '—'}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-white/60">Status</div>
                <div className="text-sm text-white/90">{activeRide.status || '—'}</div>
              </div>
            </div>

            {activeRide.status === 'ACCEPTED' ? (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => onStartRide(activeRide.id)}
                  disabled={startingRideId === activeRide.id}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {startingRideId === activeRide.id ? 'Starting…' : 'Start Ride'}
                </button>
              </div>
            ) : null}
          </div>
        </section>
      ) : (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-white/90">Ride Requests</h2>

          {loading ? <div className="text-sm text-white/60">Loading…</div> : null}

          {!loading && rides.length === 0 ? (
            <div className="text-sm text-white/60">No requests right now.</div>
          ) : null}

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
                    onClick={() => onAcceptRide(ride.id)}
                    disabled={acceptingRideId === ride.id}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {acceptingRideId === ride.id ? 'Accepting…' : 'Accept Ride'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
