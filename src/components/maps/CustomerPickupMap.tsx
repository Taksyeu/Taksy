'use client';

import * as React from 'react';
import {
  collection,
  onSnapshot,
  query,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';

import { firestore } from '@/lib/firebase/client';
import { getGoogleMapsApiKey, loadGoogleMaps } from '@/lib/maps/googleMaps';

type LatLngLiteral = { lat: number; lng: number };

type DriverLocationDoc = {
  uid: string;
  lat: number;
  lng: number;
  updatedAt: Timestamp | null;
};

const AMSTERDAM: LatLngLiteral = { lat: 52.3676, lng: 4.9041 };

function requireFirestore() {
  if (!firestore) throw new Error('Firestore is not initialized. Check NEXT_PUBLIC_FIREBASE_* env vars.');
  return firestore;
}

export function CustomerPickupMap() {
  const mapElRef = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<any>(null);
  const markerRef = React.useRef<any>(null);
  const driverMarkersRef = React.useRef<Map<string, any>>(new Map());

  const [driversRaw, setDriversRaw] = React.useState<DriverLocationDoc[]>([]);
  const [driverTick, setDriverTick] = React.useState(0);

  const [coords, setCoords] = React.useState<LatLngLiteral | null>(null);
  const [geoDenied, setGeoDenied] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Get browser location.
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!('geolocation' in navigator)) {
      setCoords(AMSTERDAM);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setGeoDenied(true);
        setCoords(AMSTERDAM);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // Subscribe to driver locations (real-time).
  React.useEffect(() => {
    let unsub: Unsubscribe | null = null;

    try {
      const db = requireFirestore();
      const q = query(collection(db, 'drivers'));
      unsub = onSnapshot(
        q,
        (snapshot) => {
          const next: DriverLocationDoc[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data() as Partial<DriverLocationDoc> & { updatedAt?: Timestamp | null };
            return {
              uid: docSnap.id,
              lat: typeof data.lat === 'number' ? data.lat : 0,
              lng: typeof data.lng === 'number' ? data.lng : 0,
              updatedAt: data.updatedAt ?? null,
            };
          });

          setDriversRaw(next);
        },
        () => {
          // No UI for driver subscription errors yet.
        }
      );
    } catch {
      // If Firestore isn't configured, just skip nearby drivers.
    }

    return () => {
      unsub?.();
    };
  }, []);

  // Tick every few seconds so drivers fall off the map after 30s.
  React.useEffect(() => {
    const id = window.setInterval(() => setDriverTick((t) => t + 1), 5_000);
    return () => window.clearInterval(id);
  }, []);

  const activeDrivers = React.useMemo(() => {
    // driverTick is used to re-run this memo on an interval.
    void driverTick;

    const cutoff = Date.now() - 30_000;
    return driversRaw.filter((d) => {
      const ts = d.updatedAt?.toMillis?.();
      if (!ts) return false;
      if (typeof d.lat !== 'number' || typeof d.lng !== 'number') return false;
      return ts >= cutoff;
    });
  }, [driversRaw, driverTick]);

  // Initialize map when coords are ready.
  React.useEffect(() => {
    const apiKey = getGoogleMapsApiKey();
    if (!apiKey) {
      setError('Google Maps API key is not configured.');
      return;
    }

    if (!coords) return;
    if (!mapElRef.current) return;

    let cancelled = false;

    loadGoogleMaps(apiKey)
      .then(() => {
        if (cancelled) return;

        const google = (window as any).google;

        if (!mapRef.current) {
          mapRef.current = new google.maps.Map(mapElRef.current, {
            center: coords,
            zoom: 14,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });
        } else {
          mapRef.current.setCenter(coords);
        }

        if (!markerRef.current) {
          markerRef.current = new google.maps.Marker({
            position: coords,
            map: mapRef.current,
            title: 'Your location',
          });
        } else {
          markerRef.current.setPosition(coords);
        }
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load map.');
      });

    return () => {
      cancelled = true;
    };
  }, [coords]);

  // Keep driver markers in sync with the active driver list.
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const google = (window as any).google;
    if (!google?.maps) return;

    const existing = driverMarkersRef.current;
    const keep = new Set(activeDrivers.map((d) => d.uid));

    // Remove stale markers.
    for (const [uid, marker] of existing.entries()) {
      if (!keep.has(uid)) {
        marker.setMap(null);
        existing.delete(uid);
      }
    }

    // Add/update active markers.
    for (const d of activeDrivers) {
      const pos = { lat: d.lat, lng: d.lng };
      const existingMarker = existing.get(d.uid);
      if (existingMarker) {
        existingMarker.setPosition(pos);
        continue;
      }

      const marker = new google.maps.Marker({
        position: pos,
        map,
        title: 'Driver',
      });
      existing.set(d.uid, marker);
    }

    return () => {
      // no-op
    };
  }, [activeDrivers]);

  React.useEffect(() => {
    return () => {
      // Cleanup driver markers on unmount.
      for (const marker of driverMarkersRef.current.values()) {
        marker.setMap(null);
      }
      driverMarkersRef.current.clear();
    };
  }, []);

  return (
    <div className="space-y-2">
      {geoDenied ? (
        <div className="text-xs text-white/50">Location permission denied — defaulting to Amsterdam.</div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div ref={mapElRef} className="h-[260px] w-full overflow-hidden rounded-xl border border-white/10" />
    </div>
  );
}
