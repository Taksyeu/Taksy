'use client';

import * as React from 'react';

import { CustomerPickupMap } from '@/components/maps/CustomerPickupMap';
import { useAuth } from '@/context/AuthContext';
import { createRideRequest } from '@/lib/firebase/rides';
import { assignNearestDriverToRide } from '@/lib/firebase/rideMatching';
import { applyToBecomeDriver } from '@/lib/firebase/users';
import { getGoogleMapsApiKey, loadGoogleMaps } from '@/lib/maps/googleMaps';
import {
  subscribeToRiderLatestRide,
  subscribeToRiderRideHistory,
  type RiderLatestRide,
  type RiderRideHistoryItem,
} from '@/lib/firebase/riderRide';

export default function CustomerPage() {
  const { firebaseUser, platformUser, loading: authLoading } = useAuth();

  const [currentRide, setCurrentRide] = React.useState<RiderLatestRide | null>(null);
  const [rideLoading, setRideLoading] = React.useState(true);

  const [rideHistory, setRideHistory] = React.useState<RiderRideHistoryItem[]>([]);

  const [pickupLocation, setPickupLocation] = React.useState('');
  const [pickupCoords, setPickupCoords] = React.useState<{ lat: number; lng: number } | null>(null);
  const [destination, setDestination] = React.useState('');

  const [estimate, setEstimate] = React.useState<{
    distanceKm: number;
    durationMinutes: number;
    estimatedPrice: number;
  } | null>(null);
  const [estimating, setEstimating] = React.useState(false);
  const [estimateError, setEstimateError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const [driverApplying, setDriverApplying] = React.useState(false);
  const [driverApplied, setDriverApplied] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // Best-effort pickup coordinates for nearest-driver matching.
    if (!('geolocation' in navigator)) {
      setPickupCoords({ lat: 52.3676, lng: 4.9041 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPickupCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        // Permission denied → default Amsterdam.
        setPickupCoords({ lat: 52.3676, lng: 4.9041 });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  React.useEffect(() => {
    if (authLoading) return;

    setRideLoading(true);

    if (!firebaseUser) {
      setCurrentRide(null);
      setRideHistory([]);
      setRideLoading(false);
      return;
    }

    let unsubLatest: (() => void) | null = null;
    let unsubHistory: (() => void) | null = null;

    try {
      unsubLatest = subscribeToRiderLatestRide(
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

      unsubHistory = subscribeToRiderRideHistory(
        firebaseUser.uid,
        (rides) => {
          setRideHistory(rides);
        },
        (err) => {
          setError(err.message);
        }
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load rides.';
      setError(message);
      setRideLoading(false);
    }

    return () => {
      unsubLatest?.();
      unsubHistory?.();
    };
  }, [authLoading, firebaseUser]);

  React.useEffect(() => {
    const pickup = pickupLocation.trim();
    const dest = destination.trim();

    if (!pickup || !dest) {
      setEstimate(null);
      setEstimateError(null);
      setEstimating(false);
      return;
    }

    let cancelled = false;
    setEstimating(true);
    setEstimateError(null);

    const timer = window.setTimeout(() => {
      const apiKey = getGoogleMapsApiKey();
      if (!apiKey) {
        if (cancelled) return;
        setEstimate(null);
        setEstimateError('Google Maps API key is not configured.');
        setEstimating(false);
        return;
      }

      loadGoogleMaps(apiKey)
        .then(() => {
          if (cancelled) return;

          const google = (window as any).google;

          // Defensive: ensure Google Maps actually initialized.
          if (!google?.maps?.DirectionsService) {
            setEstimate(null);
            setEstimateError('Google Maps is not correctly loaded on this page.');
            setEstimating(false);
            return;
          }

          const service = new google.maps.DirectionsService();

          service.route(
            {
              origin: pickup,
              destination: dest,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result: any, status: any) => {
              if (cancelled) return;

              if (status !== 'OK' || !result?.routes?.[0]?.legs?.[0]) {
                setEstimate(null);
                setEstimateError('Could not estimate route for those addresses.');
                setEstimating(false);
                return;
              }

              const leg = result.routes[0].legs[0];
              const distanceMeters = leg.distance?.value as number | undefined;
              const durationSeconds = leg.duration?.value as number | undefined;

              if (typeof distanceMeters !== 'number' || typeof durationSeconds !== 'number') {
                setEstimate(null);
                setEstimateError('Could not estimate route distance/duration.');
                setEstimating(false);
                return;
              }

              const distanceKm = distanceMeters / 1000;
              const durationMinutes = durationSeconds / 60;

              // Dutch maximum taxi tariff
              const estimatedPrice = 4.31 + distanceKm * 3.17 + durationMinutes * 0.52;

              setEstimate({ distanceKm, durationMinutes, estimatedPrice });
              setEstimating(false);
            }
          );
        })
        .catch((err) => {
          if (cancelled) return;
          setEstimate(null);
          setEstimateError(err instanceof Error ? err.message : 'Failed to load Google Maps.');
          setEstimating(false);
        });
    }, 650);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pickupLocation, destination]);

  async function onApplyToBecomeDriver() {
    setError(null);
    setDriverApplied(false);

    if (!firebaseUser) {
      setError('You must be logged in to apply.');
      return;
    }

    try {
      setDriverApplying(true);
      await applyToBecomeDriver(firebaseUser.uid);
      setDriverApplied(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit driver application.';
      setError(message);
    } finally {
      setDriverApplying(false);
    }
  }

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
      const rideId = await createRideRequest({
        riderId: firebaseUser.uid,
        pickupLocation: pickup,
        destination: dest,
        pickupLat: pickupCoords?.lat,
        pickupLng: pickupCoords?.lng,
        distanceKm: estimate?.distanceKm,
        durationMinutes: estimate?.durationMinutes,
        estimatedPrice: estimate?.estimatedPrice,
      });

      // Best-effort nearest-driver assignment.
      if (pickupCoords) {
        await assignNearestDriverToRide(rideId, pickupCoords.lat, pickupCoords.lng);
      }

      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create ride request.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const visibleHistory = React.useMemo(() => {
    const currentId = currentRide?.id;
    const currentStatus = currentRide?.status;

    return rideHistory.filter((ride) => {
      if (!currentId) return true;
      if (ride.id !== currentId) return true;
      // Exclude the current active ride from history until it is completed/cancelled.
      return ['COMPLETED', 'CANCELLED'].includes(String(currentStatus ?? '').toUpperCase());
    });
  }, [currentRide?.id, currentRide?.status, rideHistory]);

  const formatCreatedAt = React.useCallback((createdAt: RiderRideHistoryItem['createdAt']) => {
    if (!createdAt) return '—';
    const date = createdAt.toDate();
    return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }, []);

  return (
    <div className="mx-auto w-full max-w-[520px] space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Customer Dashboard</h1>
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-white/90">Pickup Location</h2>
        </div>

        <CustomerPickupMap />
      </section>

      {currentRide && !['COMPLETED', 'CANCELLED'].includes(String(currentRide.status ?? '').toUpperCase()) ? (
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
                className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2.5 text-base text-white outline-none ring-offset-neutral-950 placeholder:text-white/30 focus:ring-2 focus:ring-white/20"
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
                className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2.5 text-base text-white outline-none ring-offset-neutral-950 placeholder:text-white/30 focus:ring-2 focus:ring-white/20"
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            {estimateError ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                {estimateError}
              </div>
            ) : null}

            {estimating ? <div className="text-xs text-white/50">Estimating route…</div> : null}

            {estimate ? (
              <div className="rounded-xl border border-white/10 bg-neutral-950/40 px-3 py-2 text-sm text-white/80">
                <div>Distance: {estimate.distanceKm.toFixed(1)} km</div>
                <div>Duration: {Math.round(estimate.durationMinutes)} min</div>
                <div>
                  Estimated price:{' '}
                  {new Intl.NumberFormat('nl-NL', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(estimate.estimatedPrice)}
                </div>
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

      {firebaseUser ? (
        <>
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-white/90">Ride History</h2>
            </div>

            {visibleHistory.length === 0 ? (
              <div className="text-sm text-white/60">No ride history yet.</div>
            ) : (
              <div className="space-y-3">
                {visibleHistory.map((ride) => (
                  <div key={ride.id} className="rounded-xl border border-white/10 bg-neutral-950/40 p-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <div className="text-[11px] font-medium text-white/60">Pickup</div>
                        <div className="text-sm text-white/90">{ride.pickupLocation || '—'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-medium text-white/60">Destination</div>
                        <div className="text-sm text-white/90">{ride.destination || '—'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-medium text-white/60">Status</div>
                        <div className="text-sm text-white/90">{ride.status || '—'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-medium text-white/60">Created</div>
                        <div className="text-sm text-white/90">{formatCreatedAt(ride.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {String(platformUser?.role ?? '').toUpperCase() !== 'DRIVER' ? (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-white/90">Become a Driver</h2>
              </div>

              {driverApplied ? (
                <div className="mb-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                  Driver application submitted. Waiting for approval.
                </div>
              ) : null}

              <button
                type="button"
                onClick={onApplyToBecomeDriver}
                disabled={driverApplying}
                className="inline-flex w-full items-center justify-center rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {driverApplying ? 'Submitting…' : 'Apply to become a driver'}
              </button>
            </section>
          ) : null}
        </>
      ) : null}

      {rideLoading ? <div className="text-sm text-white/60">Loading…</div> : null}
    </div>
  );
}
