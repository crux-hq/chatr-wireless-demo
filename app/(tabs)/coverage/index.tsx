import { useMemo, useState } from 'react';
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
import { Search, ChevronDown, Navigation, Map, Smartphone, PiggyBank } from 'lucide-react-native';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { PageSubtitle } from '@/components/layout/PageSubtitle';
import { Card } from '@/components/ui/Button';
import { CoverageMap } from '@/components/coverage/CoverageMap';
import { CoverageResultCard } from '@/components/coverage/CoverageResultCard';
import { HomeAccordion } from '@/components/homepage/HomeAccordion';
import {
  COVERAGE_ZONES,
  COVERAGE_SEARCH_RESULTS,
  CANADA_COVERAGE_REGION,
  filterZonesByLayer,
  searchCoverageLocations,
  getLocationRegion,
  getFilterLabelKey,
  type CoverageLayerFilter,
  type CoverageSearchResult,
} from '@/lib/mock/coverage';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const LAYER_FILTERS: CoverageLayerFilter[] = ['all', 'nation-wide', 'extended', 'in-zone'];

export default function CoverageScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [layerFilter, setLayerFilter] = useState<CoverageLayerFilter>('all');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [mapRegion, setMapRegion] = useState(CANADA_COVERAGE_REGION);
  const [selectedResult, setSelectedResult] = useState<CoverageSearchResult | null>(null);
  const [locating, setLocating] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState<string | null>(null);

  const visibleZones = useMemo(
    () => filterZonesByLayer(COVERAGE_ZONES, layerFilter),
    [layerFilter],
  );

  const handleSearch = (text: string) => {
    setQuery(text);
    const matches = searchCoverageLocations(COVERAGE_SEARCH_RESULTS, text);
    if (matches.length === 1) {
      const match = matches[0];
      setSelectedResult(match);
      setMapRegion(getLocationRegion(match.lat, match.lng));
    } else if (!text.trim()) {
      setSelectedResult(null);
      setMapRegion(CANADA_COVERAGE_REGION);
    }
  };

  const handleUseLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = position.coords;
      setMapRegion(getLocationRegion(latitude, longitude));

      const nearest = COVERAGE_SEARCH_RESULTS.reduce((best, result) => {
        const d = Math.hypot(result.lat - latitude, result.lng - longitude);
        return !best || d < best.d ? { result, d } : best;
      }, null as { result: CoverageSearchResult; d: number } | null);

      setSelectedResult(nearest?.result ?? null);
    } finally {
      setLocating(false);
    }
  };

  const featureItems = [
    {
      id: 'nationwide',
      icon: Map,
      title: t('coverage.featureNationTitle'),
      body: t('coverage.featureNationBody'),
    },
    {
      id: 'extended',
      icon: Smartphone,
      title: t('coverage.featureExtendedTitle'),
      body: t('coverage.featureExtendedBody'),
    },
    {
      id: 'plans',
      icon: PiggyBank,
      title: t('coverage.featurePlansTitle'),
      body: t('coverage.featurePlansBody'),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('coverage.title')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}>
        <Text style={{ fontFamily: fonts.extraBold, fontSize: 20, marginBottom: spacing.xs }}>
          {t('coverage.mapTitle')}
        </Text>
        <PageSubtitle style={{ marginBottom: spacing.md }}>{t('coverage.mapSubtitle')}</PageSubtitle>

        <View
          style={{
            position: 'relative',
            zIndex: filterMenuOpen ? 50 : 2,
            marginBottom: spacing.md,
            ...Platform.select({ web: { overflow: 'visible' as const } }),
          }}>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm }}>
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
                onChangeText={handleSearch}
                placeholder={t('coverage.searchPlaceholder')}
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
              marginBottom: spacing.sm,
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
                  {t('coverage.useLocation')}
                </Text>
              </View>
            </Pressable>

            <View
              style={{
                position: 'relative',
                zIndex: filterMenuOpen ? 100 : 1,
                ...Platform.select({ web: { overflow: 'visible' as const } }),
              }}>
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
                  maxWidth: 260,
                }}>
                <Text
                  style={{ fontFamily: fonts.semiBold, color: colors.text, flexShrink: 1 }}
                  numberOfLines={1}>
                  {t(getFilterLabelKey(layerFilter))}
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
                    minWidth: 240,
                    padding: spacing.xs,
                    zIndex: 100,
                    elevation: 100,
                    ...Platform.select({
                      web: { boxShadow: '0 4px 12px rgba(45,38,59,0.15)' },
                      default: {},
                    }),
                  }}>
                  {LAYER_FILTERS.map((option) => (
                    <Pressable
                      key={option}
                      onPress={() => {
                        setLayerFilter(option);
                        setFilterMenuOpen(false);
                      }}
                      style={{
                        paddingVertical: spacing.sm,
                        paddingHorizontal: spacing.sm,
                        backgroundColor: layerFilter === option ? colors.lavender : 'transparent',
                        borderRadius: radius.sm,
                      }}>
                      <Text
                        style={{
                          fontFamily: layerFilter === option ? fonts.bold : fonts.regular,
                          color: colors.text,
                        }}>
                        {t(getFilterLabelKey(option))}
                      </Text>
                    </Pressable>
                  ))}
                </Card>
              ) : null}
            </View>
          </View>
        </View>

        <View style={{ position: 'relative', zIndex: 1 }}>
          <CoverageMap zones={visibleZones} layerFilter={layerFilter} region={mapRegion} />
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.sm, marginBottom: spacing.sm }}>
          {(
            [
              { color: colors.primary, label: t('coverage.legendNationWide') },
              { color: colors.primaryLight, label: t('coverage.legendExtended') },
              { color: colors.warning, label: t('coverage.legendInZone') },
            ] as const
          ).map((item) => (
            <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  backgroundColor: item.color,
                  opacity: 0.85,
                }}
              />
              <Text style={{ fontFamily: fonts.regular, color: colors.grayDark, fontSize: 12 }}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        <Text style={{ color: colors.grayDark, fontSize: 12, marginBottom: spacing.sm }}>
          {t('coverage.lastUpdated')}
        </Text>

        {selectedResult ? <CoverageResultCard result={selectedResult} /> : null}

        <View style={{ gap: spacing.md, marginTop: spacing.xl, marginBottom: spacing.lg }}>
          {featureItems.map((feature) => {
            const Icon = feature.icon;
            return (
              <View
                key={feature.id}
                style={{
                  width: '100%',
                  backgroundColor: colors.white,
                  borderRadius: radius.lg,
                  padding: spacing.lg,
                  borderWidth: 1,
                  borderColor: colors.grayMid,
                }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.accent,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: spacing.md,
                  }}>
                  <Icon size={24} color={colors.textOnAccent} />
                </View>
                <Text style={{ fontFamily: fonts.bold, fontSize: 16, marginBottom: spacing.xs }}>
                  {feature.title}
                </Text>
                <Text style={{ color: colors.grayDark, lineHeight: 20 }}>{feature.body}</Text>
              </View>
            );
          })}
        </View>

        <HomeAccordion
          items={[
            {
              id: 'details',
              title: t('coverage.fullDetails'),
              body: t('coverage.fullDetailsBody'),
            },
          ]}
          expandedId={detailsExpanded}
          onToggle={(id) => setDetailsExpanded(detailsExpanded === id ? null : id)}
        />

        <PublicHomeFooter />
      </PageScrollView>
    </View>
  );
}
