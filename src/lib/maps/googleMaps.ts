'use client';

export function getGoogleMapsApiKey(): string | null {
  // Support a couple common env var names; prefer the explicit one.
  return (
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY ||
    null
  );
}

export function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  const w = window as typeof window & {
    google?: any;
    __gmapsLoaderPromise?: Promise<void>;
  };

  // Already available.
  if (w.google?.maps) return Promise.resolve();
  if (w.__gmapsLoaderPromise) return w.__gmapsLoaderPromise;

  function waitForGoogleMapsReady(resolve: () => void, reject: (err: Error) => void) {
    const start = Date.now();
    const timeoutMs = 10_000;

    const tick = () => {
      if (w.google?.maps) {
        resolve();
        return;
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error('Google Maps did not initialize.'));
        return;
      }
      setTimeout(tick, 50);
    };

    tick();
  }

  w.__gmapsLoaderPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-maps="true"]');

    // If a script tag exists and Google is already on window, resolve immediately.
    if (existing && w.google?.maps) {
      resolve();
      return;
    }

    // If the script exists but the load event already fired, we can't rely on 'load' listeners.
    if (existing) {
      const loaded = existing.dataset.loaded === 'true';
      const complete = (existing as any).readyState === 'complete';

      if (loaded || complete) {
        // Script already loaded; wait until window.google.maps is actually available.
        setTimeout(() => {
          waitForGoogleMapsReady(resolve, reject);
        }, 0);
        return;
      }

      existing.addEventListener('load', () => waitForGoogleMapsReady(resolve, reject), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = 'true';
    script.onload = () => {
      script.dataset.loaded = 'true';
      waitForGoogleMapsReady(resolve, reject);
    };
    script.onerror = () => reject(new Error('Failed to load Google Maps.'));
    document.head.appendChild(script);
  });

  return w.__gmapsLoaderPromise;
}
