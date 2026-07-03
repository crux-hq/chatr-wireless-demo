import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import type { CoverageZone } from '@/lib/mock/coverage';
import {
  COVERAGE_LAYER_STYLES,
  type CoverageLayerFilter,
} from '@/lib/mock/coverage';
import { loadLeaflet, regionToZoom, type LeafletApi } from '@/lib/leaflet/web';
import { colors } from '@/lib/theme/colors';
import type { MapRegion } from '@/components/stores/StoreLocatorMap';

type CoverageMapProps = {
  zones: CoverageZone[];
  layerFilter: CoverageLayerFilter;
  region: MapRegion;
};

const MAP_CLASS = 'chatr-coverage-map';

export function CoverageMap({ zones, layerFilter, region }: CoverageMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<ReturnType<LeafletApi['map']> | null>(null);
  const polygonsRef = useRef<Array<{ remove: () => void; setStyle: (s: object) => void }>>([]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadLeaflet(MAP_CLASS)
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
      .catch(() => {});

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      polygonsRef.current = [];
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

    polygonsRef.current.forEach((polygon) => polygon.remove());
    polygonsRef.current = [];

    zones.forEach((zone) => {
      const style = COVERAGE_LAYER_STYLES[zone.type];
      const visible = layerFilter === 'all' || layerFilter === zone.type;
      const polygon = L.polygon(zone.ring, {
        color: style.stroke,
        weight: style.strokeWidth,
        fillColor: style.fill,
        fillOpacity: visible ? style.fillOpacity : 0,
        opacity: visible ? 1 : 0,
      });
      polygon.addTo(map);
      polygonsRef.current.push(polygon);
    });
  }, [zones, layerFilter, mapReady]);

  return (
    <View style={styles.container}>
      <div ref={containerRef} className={MAP_CLASS} style={{ width: '100%', height: '100%' }} />
      {!mapReady ? (
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
