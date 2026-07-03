import { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polygon, type Region } from 'react-native-maps';
import type { CoverageZone } from '@/lib/mock/coverage';
import {
  COVERAGE_LAYER_STYLES,
  type CoverageLayerFilter,
} from '@/lib/mock/coverage';

function fillWithAlpha(hex: string, opacity: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

export type CoverageMapRegion = Region;

type CoverageMapProps = {
  zones: CoverageZone[];
  layerFilter: CoverageLayerFilter;
  region: CoverageMapRegion;
};

export function CoverageMap({ zones, layerFilter, region }: CoverageMapProps) {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    mapRef.current?.animateToRegion(region, 450);
  }, [region.latitude, region.longitude, region.latitudeDelta, region.longitudeDelta]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        showsUserLocation>
        {zones.map((zone) => {
          const visible = layerFilter === 'all' || layerFilter === zone.type;
          if (!visible) return null;
          const style = COVERAGE_LAYER_STYLES[zone.type];
          return (
            <Polygon
              key={zone.id}
              coordinates={zone.ring.map(([lat, lng]) => ({ latitude: lat, longitude: lng }))}
              fillColor={fillWithAlpha(style.fill, style.fillOpacity)}
              strokeColor={style.stroke}
              strokeWidth={style.strokeWidth}
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 360,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E8E0F5',
  },
});
