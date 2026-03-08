import {
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { firestore } from '@/lib/firebase/client';

type DriverLocation = {
  uid: string;
  lat: number;
  lng: number;
  updatedAt: Timestamp | null;
};

function requireFirestore() {
  if (!firestore) throw new Error('Firestore is not initialized. Check NEXT_PUBLIC_FIREBASE_* env vars.');
  return firestore;
}

function haversineMeters(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const φ1 = toRad(aLat);
  const φ2 = toRad(bLat);
  const Δφ = toRad(bLat - aLat);
  const Δλ = toRad(bLng - aLng);

  const s1 = Math.sin(Δφ / 2);
  const s2 = Math.sin(Δλ / 2);

  const c = s1 * s1 + Math.cos(φ1) * Math.cos(φ2) * s2 * s2;
  const d = 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));

  return R * d;
}

export async function assignNearestDriverToRide(
  rideId: string,
  pickupLat: number,
  pickupLng: number
): Promise<{ assignedDriverId: string } | null> {
  const db = requireFirestore();

  const cutoff = Timestamp.fromMillis(Date.now() - 30_000);
  const q = query(collection(db, 'drivers'), where('updatedAt', '>=', cutoff));
  const snap = await getDocs(q);

  const activeDrivers: DriverLocation[] = snap.docs
    .map((d) => {
      const data = d.data() as Partial<DriverLocation> & { updatedAt?: Timestamp | null };
      return {
        uid: d.id,
        lat: typeof data.lat === 'number' ? data.lat : NaN,
        lng: typeof data.lng === 'number' ? data.lng : NaN,
        updatedAt: data.updatedAt ?? null,
      };
    })
    .filter((d) => Number.isFinite(d.lat) && Number.isFinite(d.lng));

  if (activeDrivers.length === 0) return null;

  let nearest = activeDrivers[0];
  let nearestDist = haversineMeters(pickupLat, pickupLng, nearest.lat, nearest.lng);

  for (let i = 1; i < activeDrivers.length; i++) {
    const d = activeDrivers[i];
    const dist = haversineMeters(pickupLat, pickupLng, d.lat, d.lng);
    if (dist < nearestDist) {
      nearest = d;
      nearestDist = dist;
    }
  }

  const rideRef = doc(db, 'rides', rideId);
  await updateDoc(rideRef, {
    assignedDriverId: nearest.uid,
    status: 'ASSIGNED',
  });

  return { assignedDriverId: nearest.uid };
}
