export default function CustomerPage() {
  return (
    <div className="mx-auto w-full max-w-[520px] space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Customer Dashboard</h1>
        <p className="text-sm text-white/60">Request rides and track your recent activity.</p>
      </header>

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
              placeholder="e.g. Heathrow Terminal 5"
              className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2.5 text-sm text-white outline-none ring-offset-neutral-950 placeholder:text-white/30 focus:ring-2 focus:ring-white/20"
            />
          </div>

          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
          >
            Request Ride
          </button>

          <p className="text-xs text-white/50">UI only (no ride logic yet).</p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-white/90">Recent Rides</h2>
        </div>
        <div className="text-sm text-white/60">No rides yet.</div>
      </section>
    </div>
  );
}
