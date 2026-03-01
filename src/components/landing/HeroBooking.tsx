'use client';

import * as React from 'react';

import { createDemoBooking } from '@/demo/booking';
import { calculateDemoFare } from '@/demo/fare';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function HeroBooking() {
  const [pickup, setPickup] = React.useState('');
  const [dropoff, setDropoff] = React.useState('');
  const [when, setWhen] = React.useState('');
  const [result, setResult] = React.useState<string | null>(null);

  const canSubmit = pickup.trim().length > 1 && dropoff.trim().length > 1;

  const demoDistanceKm = React.useMemo(() => {
    // Demo-only heuristic: derives a stable-looking distance from user input.
    const raw = (pickup.trim().length + dropoff.trim().length) / 3;
    return clamp(roundTo(raw, 0.5), 1, 25);
  }, [pickup, dropoff]);

  const demoMinutes = React.useMemo(() => {
    // Demo-only heuristic: ~3 min per km + baseline.
    return clamp(Math.round(demoDistanceKm * 3 + 4), 6, 75);
  }, [demoDistanceKm]);

  const breakdown = React.useMemo(() => {
    return calculateDemoFare({ distanceKm: demoDistanceKm, minutes: demoMinutes, surge: 1 });
  }, [demoDistanceKm, demoMinutes]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const res = createDemoBooking({ pickup, dropoff, when });
    setResult(res.confirmationId);
  }

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <div>
        <p className="mb-3 inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/70">
          Fase 1 demo — geen account nodig
        </p>
        <div className="max-w-[700px]">
          <h1 className="text-balance text-[52px] font-bold leading-[52px] tracking-tight text-[#000000] sm:text-[64px] sm:leading-[62px] lg:text-[88px] lg:leading-[83.6px]">
            Van AfariCab naar TAKSY
          </h1>
          <h2 className="mt-1 text-balance text-[52px] font-bold leading-[52px] tracking-tight text-[#CCCCCC] sm:text-[64px] sm:leading-[62px] lg:text-[88px] lg:leading-[83.6px]">
            gebouwd vanuit ervaring
          </h2>

          <p className="mt-4 text-pretty text-base leading-relaxed text-black/70">
            TAKSY is ontstaan uit 15.000+ ritten praktijkervaring binnen Uber en Bolt met een focus op
            stabiliteit, voorspelbaarheid en meer controle voor chauffeurs.
          </p>
        </div>

        <ul className="mt-4 max-w-xl space-y-2 text-base text-black/70">
          <li>• Vaste maandstructuur</li>
          <li>• Lage commissie per rit</li>
          <li>• Gebouwd door een actieve chauffeur</li>
        </ul>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="button"
            className="h-11 w-full justify-center rounded-md bg-[#000000] px-7 py-2 text-sm font-medium text-[#FFFFFF] hover:bg-black/90 sm:w-auto"
            onClick={() => {
              document.querySelector('#sponsors')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            Word Supporter
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-11 w-full justify-center rounded-md border border-[#000000] bg-[#FFFFFF] px-7 py-2 text-sm font-medium text-[#000000] hover:border-black/60 sm:w-auto"
            onClick={() => {
              document.querySelector('#calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            Portfolio
          </Button>
        </div>

        <div className="mt-8 rounded-xl border border-black/10 bg-white p-4 text-sm text-black/70">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-black">Demo boekingsresultaat</span>
            <span className="text-black/60">
              {result ? (
                <span>
                  Bevestigings-ID: <span className="font-mono text-black">{result}</span>
                </span>
              ) : (
                'Verstuur een demo boeking om een bevestigings-ID te genereren.'
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="relative mb-5 overflow-hidden rounded-xl border border-black/10">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/[0.03] via-transparent to-black/[0.05]" />
          <MockMapRoute key={`${pickup}|${dropoff}`} />

          <div className="absolute left-4 top-4 rounded-full border border-black/10 bg-white/90 px-3 py-1 text-xs text-black/70 backdrop-blur">
            Demo route
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <div className="rounded-xl border border-black/10 bg-white/90 px-3 py-2 text-xs text-black/70 backdrop-blur">
              <div className="text-black/50">Ophaal → Afzet</div>
              <div className="mt-1 font-medium text-black">
                {pickup.trim().length ? pickup : 'Ophaallocatie'}
                <span className="text-black/40"> → </span>
                {dropoff.trim().length ? dropoff : 'Afzetlocatie'}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-white/90 px-3 py-2 text-right backdrop-blur">
              <div className="text-xs text-black/50">Live demo tarief</div>
              <div className="mt-1 text-lg font-semibold tracking-tight text-black">
                £{breakdown.total.toFixed(2)}
              </div>
              <div className="text-xs text-black/50">{demoDistanceKm.toFixed(1)} km • {demoMinutes} min</div>
            </div>
          </div>

          <div className="h-48" />
        </div>

        <h2 className="text-lg font-semibold text-black">Demo boeking</h2>
        <p className="mt-1 text-sm text-black/60">Alleen mock. Geen Maps API. Geen extra API calls.</p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium text-black/70">Ophaal</label>
              <Input
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="bijv. Centraal Station"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-black/70">Afzet</label>
              <Input
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                placeholder="bijv. Zuidas"
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-black/70">Wanneer (optioneel)</label>
            <Input
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              placeholder="bijv. Vandaag 19:30"
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" disabled={!canSubmit}>
              Demo rit boeken
            </Button>
            <span className="text-xs text-black/50">
              Door verder te gaan bevestig je dat dit een demo is en geen echte boeking.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

function MockMapRoute() {
  return (
    <div className="absolute inset-0">
      <svg
        viewBox="0 0 800 300"
        className="h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id="taksy-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
          </pattern>
          <filter id="taksy-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>

        {/* Subtle mock map background */}
        <rect width="800" height="300" fill="url(#taksy-grid)" />
        <g opacity="0.5" filter="url(#taksy-soft)">
          <path
            d="M-40 90 C 120 40, 240 160, 410 120 S 690 80, 860 140"
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M-60 220 C 120 180, 260 260, 420 220 S 650 170, 880 240"
            fill="none"
            stroke="rgba(0,0,0,0.07)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 120 -40 C 200 80, 120 170, 240 320"
            fill="none"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </g>

        {/* Simple route animation */}
        <g>
          <path
            className="taksy-route"
            d="M 210 210 C 290 120, 420 120, 560 150 S 650 200, 680 90"
            fill="none"
            stroke="rgba(0,0,0,0.75)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="10 10"
          />
          <path
            d="M 210 210 C 290 120, 420 120, 560 150 S 650 200, 680 90"
            fill="none"
            stroke="rgba(0,0,0,0.12)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle cx="210" cy="210" r="8" fill="#0b0b0b" />
          <circle cx="680" cy="90" r="8" fill="#0b0b0b" />
          <circle cx="210" cy="210" r="13" fill="rgba(11,11,11,0.12)" />
          <circle cx="680" cy="90" r="13" fill="rgba(11,11,11,0.12)" />
        </g>
      </svg>

      <style jsx>{`
        .taksy-route {
          stroke-dashoffset: 0;
          animation: taksyDash 6s linear infinite;
        }

        @keyframes taksyDash {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -240;
          }
        }
      `}</style>
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function roundTo(n: number, step: number) {
  return Math.round(n / step) * step;
}
