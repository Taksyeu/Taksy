export type DemoFareInput = {
  distanceKm: number;
  minutes: number;
  surge: number;
};

export type DemoFareBreakdown = {
  base: number;
  distance: number;
  time: number;
  surgeMultiplier: number;
  total: number;
};

export function calculateDemoFare(input: DemoFareInput): DemoFareBreakdown {
  // Phase 1: mock logic (simple, transparent).
  const base = 2.5;
  const distance = clamp(input.distanceKm, 0, 200) * 1.35;
  const time = clamp(input.minutes, 0, 600) * 0.22;
  const surgeMultiplier = clamp(input.surge, 1, 3);

  const subtotal = base + distance + time;
  const total = round2(subtotal * surgeMultiplier);

  return {
    base: round2(base),
    distance: round2(distance),
    time: round2(time),
    surgeMultiplier,
    total,
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
