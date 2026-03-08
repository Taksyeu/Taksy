'use client';

import * as React from 'react';

type LatLngLiteral = { lat: number; lng: number };

const AMSTERDAM: LatLngLiteral = { lat: 52.3676, lng: 4.9041 };

function getGoogleMapsApiKey(): string | null {
  // Support a couple common env var names; prefer the explicit one.
  return (
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY ||
    null
  );
}

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  const w = window as typeof window & {
    google?: any;
    __gmapsLoaderPromise?: Promise<void>;
  };

  if (w.google?.maps) return Promise.resolve();
  if (w.__gmapsLoaderPromise) return w.__gmapsLoaderPromise;

  w.__gmapsLoaderPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-maps="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps.')));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps.'));
    document.head.appendChild(script);
  });

  return w.__gmapsLoaderPromise;
}

export function CustomerPickupMap() {
  const mapElRef = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<any>(null);
  const markerRef = React.useRef<any>(null);

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
