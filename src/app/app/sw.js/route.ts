// Placeholder service worker served at /app/sw.js
// IMPORTANT: No caching logic yet — this file exists only to establish the PWA foundation.

export function GET() {
  const body = `/* TAKSY platform service worker (placeholder) */\n\nself.addEventListener('install', (event) => {\n  // Activate immediately for development convenience.\n  self.skipWaiting();\n});\n\nself.addEventListener('activate', (event) => {\n  event.waitUntil(self.clients.claim());\n});\n\n// No fetch handler yet — we are intentionally NOT caching any requests at this stage.\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      // Avoid accidental caching while iterating.
      'Cache-Control': 'no-store',
    },
  });
}
