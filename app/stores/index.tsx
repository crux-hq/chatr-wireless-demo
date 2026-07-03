import { useMemo, useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { Search, MapPin, ChevronDown, Navigation } from 'lucide-react-native';
import { Header, PageTitle } from '@/components/layout/Header';
import { Card } from '@/components/ui/Button';
import { StoreLocatorMap } from '@/components/stores/StoreLocatorMap';
import { StoreDetailCard } from '@/components/stores/StoreDetailCard';
import { RetailCategoriesSection } from '@/components/stores/RetailCategoriesSection';
import { STORES } from '@/lib/mock/stores';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import {
  CANADA_MAP_REGION,
  filterStores,
  getStoreRegion,
  getNearbyRegion,
  getStoresRegion,
  sortStoresByDistance,
  type StoreFilterType,
} from '@/lib/stores/locator';
import type { Store } from '@/lib/mock/types';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const FILTER_OPTIONS: StoreFilterType[] = ['all', 'chatr', 'retail-partner'];

export default function StoresScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<StoreFilterType>('all');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [mapRegion, setMapRegion] = useState(CANADA_MAP_REGION);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [nearbyMode, setNearbyMode] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );

  const filteredStores = useMemo(
    () => filterStores(STORES, query, filterType),
    [query, filterType],
  );

  const listStores = useMemo(() => {
    if (nearbyMode && userLocation) {
      return sortStoresByDistance(filteredStores, userLocation.latitude, userLocation.longitude);
    }
    return filteredStores;
  }, [filteredStores, nearbyMode, userLocation]);

  useEffect(() => {
    if (!query.trim() || nearbyMode) return;
    if (filteredStores.length > 0 && filteredStores.length <= 8) {
      setMapRegion(getStoresRegion(filteredStores));
    }
  }, [query, filteredStores, nearbyMode]);

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    setMapRegion(getStoreRegion(store));
  };

  const handleUseLocation = async () => {
    setLocationError(null);
    setLocating(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(t('stores.locationDenied'));
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = position.coords;
      const nearby = sortStoresByDistance(STORES, latitude, longitude);
      const closest = nearby[0];

      setUserLocation({ latitude, longitude });
      setNearbyMode(true);
      setMapRegion(getNearbyRegion(latitude, longitude));
      if (closest) setSelectedStore(closest);
    } catch {
      setLocationError(t('stores.locationError'));
    } finally {
      setLocating(false);
    }
  };

  const filterLabel = (type: StoreFilterType) => {
    if (type === 'all') return t('stores.filterAll');
    if (type === 'chatr') return t('stores.filterChatr');
    return t('stores.filterRetail');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('stores.title')}</PageTitle>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}>
        <Text style={{ fontFamily: fonts.extraBold, fontSize: 20, marginBottom: spacing.md }}>
          {t('stores.findTitle')}
        </Text>

        <View
          style={{
            position: 'relative',
            zIndex: filterMenuOpen ? 50 : 2,
            marginBottom: spacing.md,
          }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.white,
              borderRadius: radius.sm,
              borderWidth: 1,
              borderColor: colors.grayMid,
              paddingHorizontal: spacing.md,
            }}>
            <Search size={18} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                setNearbyMode(false);
              }}
              placeholder={t('stores.searchPlaceholder')}
              placeholderTextColor={colors.textMuted}
              style={{
                flex: 1,
                paddingVertical: spacing.sm + 4,
                paddingHorizontal: spacing.sm,
                fontFamily: fonts.regular,
                fontSize: 16,
                color: colors.text,
              }}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing.md,
            flexWrap: 'wrap',
            gap: spacing.sm,
          }}>
          <Pressable onPress={handleUseLocation} disabled={locating}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {locating ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Navigation size={16} color={colors.primary} />
              )}
              <Text style={{ color: colors.primary, fontFamily: fonts.semiBold }}>
                {t('stores.useLocation')}
              </Text>
            </View>
          </Pressable>

          <View style={{ position: 'relative', zIndex: filterMenuOpen ? 51 : 1 }}>
            <Pressable
              onPress={() => setFilterMenuOpen((open) => !open)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: colors.white,
                borderRadius: radius.sm,
                borderWidth: 1,
                borderColor: colors.grayMid,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
              }}>
              <Text style={{ fontFamily: fonts.semiBold, color: colors.text }}>
                {filterLabel(filterType)}
              </Text>
              <ChevronDown size={16} color={colors.textMuted} />
            </Pressable>
            {filterMenuOpen ? (
              <Card
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 4,
                  minWidth: 200,
                  padding: spacing.xs,
                  zIndex: 51,
                  elevation: 51,
                  ...Platform.select({
                    web: { boxShadow: '0 4px 12px rgba(45,38,59,0.15)' },
                    default: {},
                  }),
                }}>
                {FILTER_OPTIONS.map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => {
                      setFilterType(option);
                      setFilterMenuOpen(false);
                    }}
                    style={{
                      paddingVertical: spacing.sm,
                      paddingHorizontal: spacing.sm,
                      backgroundColor: filterType === option ? colors.lavender : 'transparent',
                      borderRadius: radius.sm,
                    }}>
                    <Text
                      style={{
                        fontFamily: filterType === option ? fonts.bold : fonts.regular,
                        color: colors.text,
                      }}>
                      {filterLabel(option)}
                    </Text>
                  </Pressable>
                ))}
              </Card>
            ) : null}
          </View>
        </View>

        {locationError ? (
          <Text style={{ color: colors.red, marginBottom: spacing.sm }}>{locationError}</Text>
        ) : null}

        <View style={{ flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: colors.primary,
                borderWidth: 2,
                borderColor: colors.white,
              }}
            />
            <Text style={{ fontFamily: fonts.regular, color: colors.grayDark, fontSize: 13 }}>
              {t('stores.legendChatr')}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: colors.accent,
                borderWidth: 2,
                borderColor: colors.white,
              }}
            />
            <Text style={{ fontFamily: fonts.regular, color: colors.grayDark, fontSize: 13 }}>
              {t('stores.legendRetail')}
            </Text>
          </View>
        </View>
        </View>

        <View style={{ position: 'relative', zIndex: 1 }}>
        <StoreLocatorMap
          stores={filteredStores}
          selectedStoreId={selectedStore?.id ?? null}
          region={mapRegion}
          onStoreSelect={handleStoreSelect}
        />
        </View>

        {selectedStore ? (
          <View style={{ marginTop: spacing.md }}>
            <StoreDetailCard store={selectedStore} onClose={() => setSelectedStore(null)} />
          </View>
        ) : null}

        <Text style={{ fontFamily: fonts.bold, fontSize: 16, marginTop: spacing.lg, marginBottom: spacing.sm }}>
          {t('stores.results', { count: listStores.length })}
        </Text>

        {listStores.map((store) => (
          <Pressable key={store.id} onPress={() => handleStoreSelect(store)}>
            <Card
              style={{
                marginBottom: spacing.sm,
                borderWidth: selectedStore?.id === store.id ? 2 : 0,
                borderColor: colors.primary,
              }}>
              <Text style={{ fontFamily: fonts.semiBold }}>{store.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <MapPin size={14} color={colors.primary} />
                <Text style={{ color: colors.grayDark, flex: 1 }}>
                  {store.city}, {store.province}
                </Text>
              </View>
            </Card>
          </Pressable>
        ))}

        <RetailCategoriesSection />
        <PublicHomeFooter />
      </ScrollView>
    </View>
  );
}
