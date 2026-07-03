import { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import type { Store } from '@/lib/mock/types';
import { getMarkerColor } from '@/lib/stores/locator';

export type MapRegion = Region;

type StoreLocatorMapProps = {
  stores: Store[];
  selectedStoreId: string | null;
  region: MapRegion;
  onStoreSelect: (store: Store) => void;
};

export function StoreLocatorMap({ stores, selectedStoreId, region, onStoreSelect }: StoreLocatorMapProps) {
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
        onRegionChangeComplete={() => {}}
        showsUserLocation
        showsMyLocationButton={false}>
        {stores.map((store) => (
          <Marker
            key={store.id}
            coordinate={{ latitude: store.lat, longitude: store.lng }}
            pinColor={getMarkerColor(store)}
            onPress={() => onStoreSelect(store)}
            opacity={selectedStoreId && selectedStoreId !== store.id ? 0.65 : 1}
          />
        ))}
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
