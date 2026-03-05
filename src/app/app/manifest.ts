import type { MetadataRoute } from 'next';

// Note: This manifest is scoped to /app via its route location (src/app/app/manifest.ts)
// and should be available at: /app/manifest.webmanifest
export default function manifest(): MetadataRoute.Manifest {
  return {
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
}
