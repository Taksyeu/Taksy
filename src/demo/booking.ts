export type DemoBookingRequest = {
  pickup: string;
  dropoff: string;
  when?: string;
};

export type DemoBookingResult = {
  ok: true;
  confirmationId: string;
};

export function createDemoBooking(req: DemoBookingRequest): DemoBookingResult {
  // Phase 1: mock only. No API calls, no persistence.
  const seed = `${req.pickup}|${req.dropoff}|${req.when ?? ''}|${Date.now()}`;
  const confirmationId = `TAKSY-DEMO-${hash(seed).slice(0, 10).toUpperCase()}`;
  return { ok: true, confirmationId };
}

function hash(input: string) {
  // Tiny non-crypto hash to generate stable-looking IDs.
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(16);
}
