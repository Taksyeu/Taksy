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
  const subtotal = breakdown.base + breakdown.distance + breakdown.time;
  const surchargeAmount = Math.max(0, breakdown.total - subtotal);

  return (
    <Card className="bg-white">
      {/* Title / intro */}
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight text-black">Demo tariefcalculator</h2>
        <p className="mt-3 text-base text-black/70">
          Demo-prijslogica om UI/UX te valideren. Echte tarieven en betalingen volgen in een latere fase.
        </p>
      </div>

      {/* Inputs */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-2 block text-xs font-medium text-black/70">Afstand (km)</label>
          <Input
            type="number"
            min={0}
            step={0.5}
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-black/70">Duur (minuten)</label>
          <Input
            type="number"
            min={0}
            step={1}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-black/70">Toeslagfactor</label>
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
        Deze calculator is bewust eenvoudig en transparant. Geen verborgen kosten, geen backend.
      </p>

      <div className="mt-8 h-px w-full bg-black/10" />

      {/* Price breakdown */}
      <div className="mt-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="text-sm font-semibold text-black">Geschatte totaalprijs</h3>
            <p className="mt-1 text-xs text-black/50">Mock currency: EUR</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-semibold tracking-tight text-black">€{breakdown.total.toFixed(2)}</div>
            <div className="mt-1 text-xs text-black/50">Toeslag × {breakdown.surgeMultiplier.toFixed(1)}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-2 text-sm text-black/70">
          <Row label="Subtotaal" value={`€${subtotal.toFixed(2)}`} />
          <Row label="Eventuele toeslag" value={`€${surchargeAmount.toFixed(2)}`} />
          <Row label="Totaalprijs" value={`€${breakdown.total.toFixed(2)}`} />
        </div>
      </div>
    </Card>
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
