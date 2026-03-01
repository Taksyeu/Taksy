'use client';

import * as React from 'react';

import { Button } from '@/components/ui/Button';

export function CTA() {
  const [note, setNote] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
      <div className="max-w-xl">
        <h2 className="text-2xl font-semibold tracking-tight text-black">Ready to build the real platform?</h2>
        <p className="mt-3 text-base text-black/70">
          Login and registration are placeholders in Phase 1. Phase 2 introduces auth, role routing, and
          dashboard shells.
        </p>
        {note ? <p className="mt-3 text-sm text-black/60">{note}</p> : null}
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button
          variant="secondary"
          type="button"
          onClick={() => setNote('Login placeholder. Auth starts in Phase 2.')}
        >
          Login
        </Button>
        <Button type="button" onClick={() => setNote('Register placeholder. Auth starts in Phase 2.')}>
          Register
        </Button>
      </div>
    </div>
  );
}
