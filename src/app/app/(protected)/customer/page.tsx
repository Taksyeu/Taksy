'use client';

import * as React from 'react';

import { useAuth } from '@/context/AuthContext';
import { createRideRequest } from '@/lib/firebase/rides';
import { subscribeToRiderLatestRide, type RiderLatestRide } from '@/lib/firebase/riderRide';

export default function CustomerPage() {
  const { firebaseUser, loading: authLoading } = useAuth();

  const [currentRide, setCurrentRide] = React.useState<RiderLatestRide | null>(null);
  const [rideLoading, setRideLoading] = React.useState(true);

  const [pickupLocation, setPickupLocation] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (authLoading) return;

    setRideLoading(true);

    if (!firebaseUser) {
      setCurrentRide(null);
      setRideLoading(false);
      return;
    }

    let unsub: (() => void) | null = null;

    try {
      unsub = subscribeToRiderLatestRide(
        firebaseUser.uid,
        (ride) => {
          setCurrentRide(ride);
          setRideLoading(false);
        },
        (err) => {
          setError(err.message);
          setRideLoading(false);
        }
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load current ride.';
      setError(message);
      setRideLoading(false);
    }

    return () => {
      unsub?.();
    };
  }, [authLoading, firebaseUser]);

  async function onRequestRide() {
    setError(null);
    setSuccess(false);

    if (!firebaseUser) {
      setError('You must be logged in to request a ride.');
      return;
    }

    const pickup = pickupLocation.trim();
    const dest = destination.trim();

    if (!pickup || !dest) {
      setError('Please enter both pickup location and destination.');
      return;
    }

    try {
      setIsSubmitting(true);
      await createRideRequest({
        riderId: firebaseUser.uid,
        pickupLocation: pickup,
        destination: dest,
      });
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create ride request.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[520px] space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Customer Dashboard</h1>
      </header>

      {currentRide ? (
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-white/90">Current Ride</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <div className="text-xs font-medium text-white/60">Pickup</div>
              <div className="text-sm text-white/90">{currentRide.pickupLocation || '—'}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-white/60">Destination</div>
              <div className="text-sm text-white/90">{currentRide.destination || '—'}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-white/60">Status</div>
              <div className="text-sm text-white/90">{currentRide.status || '—'}</div>
            </div>
          </div>

          <p className="mt-4 text-xs text-white/50">
            Status updates in real time: REQUESTED, ACCEPTED, DRIVER_ARRIVING, IN_PROGRESS, COMPLETED.
          </p>
        </section>
      ) : (
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-white/90">Request a Ride</h2>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="pickup" className="text-xs font-medium text-white/70">
                Pickup location
              </label>
              <input
                id="pickup"
                name="pickup"
                type="text"
                inputMode="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="e.g. 221B Baker Street"
                className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2.5 text-sm text-white outline-none ring-offset-neutral-950 placeholder:text-white/30 focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="destination" className="text-xs font-medium text-white/70">
                Destination
              </label>
              <input
                id="destination"
                name="destination"
                type="text"
                inputMode="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Heathrow Terminal 5"
                className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2.5 text-sm text-white outline-none ring-offset-neutral-950 placeholder:text-white/30 focus:ring-2 focus:ring-white/20"
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                Ride request created.
              </div>
            ) : null}

            <button
              type="button"
              onClick={onRequestRide}
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Requesting…' : 'Request Ride'}
            </button>

            <p className="text-xs text-white/50">No driver matching yet — this only creates a ride request.</p>
          </div>
        </section>
      )}

      {rideLoading ? <div className="text-sm text-white/60">Loading…</div> : null}
    </div>
  );
}
