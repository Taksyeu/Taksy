import { Card } from '@/components/ui/Card';

const steps = [
  {
    title: 'Request',
    body: 'Enter pickup & drop-off. In later phases this becomes a real booking flow with validation and dispatch.',
  },
  {
    title: 'Match',
    body: 'Drivers are routed by role, availability, and location. Phase 2 introduces auth + dashboards.',
  },
  {
    title: 'Ride',
    body: 'Trip tracking, receipts, and reliability-first ops. Phase 5 brings the real booking engine and maps.',
  },
];

export function HowItWorks() {
  return (
    <div>
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight text-black">How TAKSY works</h2>
        <p className="mt-3 text-base text-black/70">
          A production-grade system needs clear boundaries: public marketing, authenticated routing,
          secure backend, and payments — built in phases.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <Card key={s.title} className="transition-colors duration-200 hover:border-black/20">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-black">{s.title}</h3>
              <span className="text-xs text-black/40">Phase-ready</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-black/60">{s.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
