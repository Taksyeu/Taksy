'use client';

import * as React from 'react';

export default function PwaRegisterPage() {
  const [status, setStatus] = React.useState<string>('idle');

  React.useEffect(() => {
    let cancelled = false;

    async function register() {
      if (!('serviceWorker' in navigator)) {
        if (!cancelled) setStatus('serviceWorker not supported');
        return;
      }

      try {
        const reg = await navigator.serviceWorker.register('/app/sw.js', { scope: '/app/' });
        if (!cancelled) setStatus(`registered: ${reg.scope}`);
      } catch (err) {
        if (!cancelled) setStatus(`failed: ${(err as Error).message}`);
      }
    }

    register();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold tracking-tight">PWA (dev helper)</h1>
      <p className="text-sm text-white/70">
        This page registers the placeholder service worker for the /app scope. We can remove/replace
        this later when we decide the final app-shell registration strategy.
      </p>
      <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/70">
        Status: <span className="text-white">{status}</span>
      </div>
    </div>
  );
}
