import { ScrollView, View, Text, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Card, Badge } from '@/components/ui/Button';
import { colors, spacing } from '@/lib/theme/colors';

const REGIONS = [
  { name: 'Ontario', coverage: 'excellent' },
  { name: 'Quebec', coverage: 'excellent' },
  { name: 'British Columbia', coverage: 'excellent' },
  { name: 'Alberta', coverage: 'good' },
  { name: 'Manitoba', coverage: 'good' },
  { name: 'Saskatchewan', coverage: 'good' },
  { name: 'Atlantic Canada', coverage: 'good' },
  { name: 'Northern Territories', coverage: 'available' },
];

export default function CoverageScreen() {
  const { t } = useTranslation();

  const coverageLabel = (c: string) => {
    if (c === 'excellent') return t('coverage.excellent');
    if (c === 'good') return t('coverage.good');
    return t('coverage.available');
  };

  const coverageColor = (c: string) => {
    if (c === 'excellent') return colors.green;
    if (c === 'good') return colors.greenDark;
    return colors.orange;
  };

  return (
    <>
      <Stack.Screen options={{ title: t('coverage.title'), headerShown: true }} />
      <ScrollView style={{ flex: 1, backgroundColor: colors.gray }} contentContainerStyle={{ padding: spacing.md }}>
        <Text style={{ fontWeight: '800', fontSize: 20, marginBottom: 4 }}>{t('coverage.subtitle')}</Text>
        <Text style={{ color: colors.grayDark, marginBottom: spacing.lg }}>{t('common.nationWide')}</Text>

        <Card style={{ marginBottom: spacing.lg, backgroundColor: colors.green, padding: spacing.lg }}>
          <Text style={{ color: colors.white, fontWeight: '800', fontSize: 18 }}>🇨🇦 Canada</Text>
          <Text style={{ color: colors.white, opacity: 0.9, marginTop: 8 }}>
            {Platform.OS === 'web'
              ? 'Interactive map available on device. Nation-wide Rogers network coverage.'
              : 'Nation-wide Rogers network — coast to coast'}
          </Text>
        </Card>

        {REGIONS.map((region) => (
          <Card key={region.name} style={{ marginBottom: spacing.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontWeight: '600' }}>{region.name}</Text>
            <Badge label={coverageLabel(region.coverage)} color={coverageColor(region.coverage)} />
          </Card>
        ))}
      </ScrollView>
    </>
  );
}
