import Link from 'next/link';

export default function PlatformHomePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">TAKSY Platform</h1>
        <p className="text-sm text-white/70">
          This is the /app area. It will become the taxi platform PWA (drivers + customers). No
          business logic is implemented yet.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10" href="/app/driver">
          <div className="text-sm font-medium">Driver</div>
          <div className="mt-1 text-xs text-white/60">Driver dashboard & onboarding</div>
        </Link>
        <Link className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10" href="/app/customer">
          <div className="text-sm font-medium">Customer</div>
          <div className="mt-1 text-xs text-white/60">Customer booking experience</div>
        </Link>
        <Link className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10" href="/app/ride">
          <div className="text-sm font-medium">Ride</div>
          <div className="mt-1 text-xs text-white/60">Ride status & matching core</div>
        </Link>
        <Link className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10" href="/app/settings">
          <div className="text-sm font-medium">Settings</div>
          <div className="mt-1 text-xs text-white/60">Preferences & profile</div>
        </Link>
        <Link className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10" href="/app/support">
          <div className="text-sm font-medium">Support</div>
          <div className="mt-1 text-xs text-white/60">Help & contact</div>
        </Link>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-medium">PWA endpoints (platform-scoped)</div>
        <ul className="mt-2 list-inside list-disc text-xs text-white/60">
          <li>
            Manifest: <span className="text-white/80">/app/manifest.webmanifest</span>
          </li>
          <li>
            Service worker: <span className="text-white/80">/app/sw.js</span> (placeholder; no caching logic)
          </li>
        </ul>
      </div>
    </div>
  );
}
