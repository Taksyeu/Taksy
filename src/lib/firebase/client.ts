import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug: verify the public Firebase env vars are present in the built client bundle.
// This will only run in the browser.
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.log('Firebase env check', {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
}

const isBrowser = typeof window !== 'undefined';
const hasPublicConfig = Object.values(firebaseConfig).every(Boolean);

function initFirebase(): FirebaseApp {
  // Initialize only once (singleton) across hot reloads / module re-imports.
  if (getApps().length) return getApp();
  return initializeApp(firebaseConfig);
}

// NOTE:
// - We only initialize Firebase in the browser.
// - This prevents Next.js build-time prerender/SSR from crashing when NEXT_PUBLIC_*
//   env vars are not present in the build environment.
// - At runtime (browser), Vercel will have NEXT_PUBLIC_* baked into the bundle.
export const firebaseApp: FirebaseApp | null = isBrowser && hasPublicConfig ? initFirebase() : null;
export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export const firestore: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;
