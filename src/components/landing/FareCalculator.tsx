'use client';

import * as React from 'react';

import { calculateDemoFare } from '@/demo/fare';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export function FareCalculator() {
  const [distanceKm, setDistanceKm] = React.useState(8);
  const [minutes, setMinutes] = React.useState(18);
  const [surge, setSurge] = React.useState(1);

  const breakdown = calculateDemoFare({ distanceKm, minutes, surge });

  return (
    <div>
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight text-black">Demo fare calculator</h2>
        <p className="mt-3 text-base text-black/70">
          Mock pricing logic to validate UI/UX. Real pricing and payments are Phase 4+.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <Card className="bg-white">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-medium text-black/70">Distance (km)</label>
              <Input
                type="number"
                min={0}
                step={0.5}
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-black/70">Minutes</label>
              <Input
                type="number"
                min={0}
                step={1}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-black/70">Surge</label>
              <Input
                type="number"
                min={1}
                max={3}
                step={0.1}
                value={surge}
                onChange={(e) => setSurge(Number(e.target.value))}
              />
            </div>
          </div>

          <p className="mt-4 text-xs text-black/50">
            This calculator is intentionally simple and transparent — no hidden fees, no backend.
          </p>
        </Card>

        <Card className="bg-white">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h3 className="text-sm font-semibold text-black">Estimated total</h3>
              <p className="mt-1 text-xs text-black/50">Mock currency: GBP</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-semibold tracking-tight text-black">£{breakdown.total.toFixed(2)}</div>
              <div className="mt-1 text-xs text-black/50">Surge × {breakdown.surgeMultiplier.toFixed(1)}</div>
            </div>
          </div>

          <div className="mt-6 grid gap-2 text-sm text-black/70">
            <Row label="Base" value={`£${breakdown.base.toFixed(2)}`} />
            <Row label="Distance" value={`£${breakdown.distance.toFixed(2)}`} />
            <Row label="Time" value={`£${breakdown.time.toFixed(2)}`} />
          </div>

          <div className="mt-6 border-t border-black/10 pt-4 text-xs text-black/50">
            Real fare rules will be versioned and audited when we connect Firebase and Stripe.
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="font-mono text-black">{value}</span>
    </div>
  );
}
