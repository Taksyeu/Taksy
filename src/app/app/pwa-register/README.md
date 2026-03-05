# PWA registration helper

This route exists only as a minimal, explicit way to register the placeholder service worker during early development.

- URL: `/app/pwa-register`
- SW URL: `/app/sw.js`
- Scope: `/app/`

Once the platform has a real app-shell and install UX, we can register the SW from a persistent client component in the `/app` layout (or another agreed strategy) and remove this helper route.
