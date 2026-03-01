'use client';

import * as React from 'react';

import { createDemoBooking } from '@/demo/booking';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function HeroBooking() {
  const [pickup, setPickup] = React.useState('');
  const [dropoff, setDropoff] = React.useState('');
  const [when, setWhen] = React.useState('');
  const [result, setResult] = React.useState<string | null>(null);

  const canSubmit = pickup.trim().length > 1 && dropoff.trim().length > 1;

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
          Phase 1 demo — no account required
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-black sm:text-5xl">
          The Uber-evolution taxi platform — built for reliability.
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-black/70">
          TAKSY is a modern, scalable foundation for riders, drivers, and operators. This page is a
          mock-only demo for booking and pricing.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="#sponsors">See sponsor tiers</Button>
          <Button variant="secondary" href="#how-it-works">
            How it works
          </Button>
        </div>

        <div className="mt-8 rounded-xl border border-black/10 bg-white p-4 text-sm text-black/70">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-black">Demo booking output</span>
            <span className="text-black/60">
              {result ? (
                <span>
                  Confirmation ID: <span className="font-mono text-black">{result}</span>
                </span>
              ) : (
                'Submit a demo booking to generate a confirmation id.'
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Demo booking</h2>
        <p className="mt-1 text-sm text-black/60">Mock only. No API calls. No persistence.</p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium text-black/70">Pickup</label>
              <Input
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="e.g. King’s Cross"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-black/70">Drop-off</label>
              <Input
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                placeholder="e.g. Canary Wharf"
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-black/70">When (optional)</label>
            <Input
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              placeholder="e.g. Today 19:30"
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" disabled={!canSubmit}>
              Book demo ride
            </Button>
            <span className="text-xs text-black/50">
              By continuing you agree this is a demo and not a real booking.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
