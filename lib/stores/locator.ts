import type { Store, StoreType, RetailCategory } from '@/lib/mock/types';

export type StoreFilterType = 'all' | StoreType;

export const CANADA_MAP_REGION = {
  latitude: 54.5,
  longitude: -96.0,
  latitudeDelta: 28,
  longitudeDelta: 42,
};

export function getStoreRegion(store: Store) {
  return {
    latitude: store.lat,
    longitude: store.lng,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  };
}

export function filterStores(
  stores: Store[],
  query: string,
  filterType: StoreFilterType,
): Store[] {
  const q = query.trim().toLowerCase();

  return stores.filter((store) => {
    if (filterType !== 'all' && store.storeType !== filterType) return false;
    if (!q) return true;

    const haystack = [
      store.name,
      store.address,
      store.city,
      store.province,
      store.postalCode ?? '',
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(q);
  });
}

export function getMarkerColor(store: Store): string {
  return store.storeType === 'chatr' ? '#542E91' : '#FFB81C';
}

export const RETAIL_CATEGORIES: RetailCategory[] = ['grocery', 'drug', 'gas', 'convenience'];

export function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function sortStoresByDistance(stores: Store[], lat: number, lng: number): Store[] {
  return [...stores].sort(
    (a, b) => getDistanceKm(lat, lng, a.lat, a.lng) - getDistanceKm(lat, lng, b.lat, b.lng),
  );
}

export function getNearbyRegion(lat: number, lng: number) {
  return {
    latitude: lat,
    longitude: lng,
    latitudeDelta: 0.35,
    longitudeDelta: 0.35,
  };
}

export function getStoresRegion(stores: Store[]) {
  if (stores.length === 0) return CANADA_MAP_REGION;
  if (stores.length === 1) return getStoreRegion(stores[0]);

  const lats = stores.map((s) => s.lat);
  const lngs = stores.map((s) => s.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latitudeDelta = Math.max(0.08, (maxLat - minLat) * 1.6 + 0.05);
  const longitudeDelta = Math.max(0.08, (maxLng - minLng) * 1.6 + 0.05);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta,
    longitudeDelta,
  };
}
