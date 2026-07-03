import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import type { Store } from '@/lib/mock/types';
import { getMarkerColor } from '@/lib/stores/locator';
import { colors } from '@/lib/theme/colors';
import type { MapRegion } from './StoreLocatorMap';

type StoreLocatorMapProps = {
  stores: Store[];
  selectedStoreId: string | null;
  region: MapRegion;
  onStoreSelect: (store: Store) => void;
};

type LeafletMap = {
  setView: (center: [number, number], zoom: number, options?: { animate?: boolean; duration?: number }) => void;
  remove: () => void;
};

type LeafletCircleMarker = {
  on: (event: string, handler: () => void) => void;
  addTo: (map: LeafletMap) => LeafletCircleMarker;
  remove: () => void;
};

type LeafletApi = {
  map: (element: HTMLElement, options?: object) => LeafletMap;
  tileLayer: (url: string, options?: object) => { addTo: (map: LeafletMap) => void };
  circleMarker: (latlng: [number, number], options?: object) => LeafletCircleMarker;
};

declare global {
  interface Window {
    L?: LeafletApi;
  }
}

const LEAFLET_VERSION = '1.9.4';
const LEAFLET_CSS_ID = 'chatr-leaflet-css';
const LEAFLET_SCRIPT_ID = 'chatr-leaflet-js';

let leafletLoadPromise: Promise<LeafletApi> | null = null;

function loadLeaflet(): Promise<LeafletApi> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Leaflet is only available in the browser'));
  }

  if (window.L) return Promise.resolve(window.L);
  if (leafletLoadPromise) return leafletLoadPromise;

  leafletLoadPromise = new Promise((resolve, reject) => {
    if (!document.getElementById(LEAFLET_CSS_ID)) {
      const link = document.createElement('link');
      link.id = LEAFLET_CSS_ID;
      link.rel = 'stylesheet';
      link.href = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
      document.head.appendChild(link);
    }

    if (!document.getElementById('chatr-leaflet-stack-fix')) {
      const style = document.createElement('style');
      style.id = 'chatr-leaflet-stack-fix';
      style.textContent = `
        .chatr-store-map .leaflet-pane { z-index: auto !important; }
        .chatr-store-map .leaflet-tile-pane { z-index: 1 !important; }
        .chatr-store-map .leaflet-overlay-pane { z-index: 2 !important; }
        .chatr-store-map .leaflet-marker-pane { z-index: 3 !important; }
        .chatr-store-map .leaflet-tooltip-pane { z-index: 4 !important; }
        .chatr-store-map .leaflet-popup-pane { z-index: 5 !important; }
        .chatr-store-map .leaflet-control-container { z-index: 6 !important; }
      `;
      document.head.appendChild(style);
    }

    const existingScript = document.getElementById(LEAFLET_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.L) resolve(window.L);
        else reject(new Error('Leaflet failed to initialize'));
      });
      existingScript.addEventListener('error', () => reject(new Error('Leaflet script failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.id = LEAFLET_SCRIPT_ID;
    script.src = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;
    script.async = true;
    script.onload = () => {
      if (window.L) resolve(window.L);
      else reject(new Error('Leaflet failed to initialize'));
    };
    script.onerror = () => reject(new Error('Leaflet script failed to load'));
    document.head.appendChild(script);
  });

  return leafletLoadPromise;
}

function regionToZoom(latitudeDelta: number) {
  return Math.min(14, Math.max(3, Math.round(Math.log2(360 / latitudeDelta) - 1)));
}

export function StoreLocatorMap({ stores, selectedStoreId, region, onStoreSelect }: StoreLocatorMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletCircleMarker[]>([]);
  const onStoreSelectRef = useRef(onStoreSelect);
  const [mapReady, setMapReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  onStoreSelectRef.current = onStoreSelect;

  useEffect(() => {
    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current || mapRef.current) return;

        const map = L.map(containerRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
        });
        map.setView([region.latitude, region.longitude], regionToZoom(region.latitudeDelta));

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;
        setMapReady(true);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = [];
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    map.setView([region.latitude, region.longitude], regionToZoom(region.latitudeDelta), {
      animate: true,
      duration: 0.45,
    });
  }, [region.latitude, region.longitude, region.latitudeDelta, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    const L = window.L;
    if (!map || !L || !mapReady) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    stores.forEach((store) => {
      const color = getMarkerColor(store);
      const selected = selectedStoreId === store.id;
      const marker = L.circleMarker([store.lat, store.lng], {
        radius: selected ? 11 : 9,
        color: '#FFFFFF',
        weight: 2,
        fillColor: color,
        fillOpacity: selectedStoreId && !selected ? 0.55 : 1,
      });

      marker.on('click', () => onStoreSelectRef.current(store));
      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [stores, selectedStoreId, mapReady]);

  return (
    <View style={styles.container}>
      <div ref={containerRef} className="chatr-store-map" style={{ width: '100%', height: '100%' }} />
      {!mapReady && !loadError ? (
        <View style={styles.overlay}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 420,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E8E0F5',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(243, 240, 255, 0.85)',
  },
});
