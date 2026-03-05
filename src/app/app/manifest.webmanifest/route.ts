// Platform-scoped web app manifest served at /app/manifest.webmanifest
// (kept inside the /app route segment so the sponsor site at / remains unaffected.)

export function GET() {
  const manifest = {
    name: 'TAKSY Platform',
    short_name: 'TAKSY',
    description: 'TAKSY taxi platform (PWA) — drivers and customers.',
    start_url: '/app',
    scope: '/app',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
    ],
  };

  return Response.json(manifest, {
    headers: {
      // Correct-ish manifest content type (browsers accept application/json too, but this is better).
      'Content-Type': 'application/manifest+json; charset=utf-8',
      // Avoid caching while iterating.
      'Cache-Control': 'no-store',
    },
  });
}
