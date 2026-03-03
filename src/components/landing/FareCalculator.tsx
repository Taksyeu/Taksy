'use client';

import * as React from 'react';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

const STARTTARIEF = 3.5;
const PRIJS_PER_KM = 2.4;
const PRIJS_PER_MIN = 0.4;
const BTW_PERCENTAGE = 9;
const PLATFORM_PERCENTAGE = 0.07;
const VASTE_PLATFORM_FEE = 0.5;

export function FareCalculator() {
  const [distanceKm, setDistanceKm] = React.useState(8);
  const [minutes, setMinutes] = React.useState(18);
  const [surge, setSurge] = React.useState(1);

  const rideBase = STARTTARIEF + distanceKm * PRIJS_PER_KM + minutes * PRIJS_PER_MIN;
  const ritprijs = rideBase * surge;
  const btw = (ritprijs * BTW_PERCENTAGE) / (100 + BTW_PERCENTAGE);
  const platformvergoeding = ritprijs * PLATFORM_PERCENTAGE + VASTE_PLATFORM_FEE;
  const chauffeurOntvangt = ritprijs - btw - platformvergoeding;

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
        <div className="mt-6 grid gap-2 text-sm text-black/70">
          <Row label="Geschatte totaalprijs (incl. btw)" value={`€${Number(ritprijs).toFixed(2)}`} />
          <Row label="BTW-bedrag" value={`€${Number(btw).toFixed(2)}`} />
          <Row label="Platformvergoeding" value={`€${Number(platformvergoeding).toFixed(2)}`} />
          <Row label="Chauffeur ontvangt" value={`€${Number(chauffeurOntvangt).toFixed(2)}`} />
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
