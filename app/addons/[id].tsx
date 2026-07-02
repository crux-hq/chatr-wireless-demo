import { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Card, Badge } from '@/components/ui/Button';
import { getAddOnById } from '@/lib/mock/add-ons';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/i18n';
import { colors, spacing } from '@/lib/theme/colors';

export default function AddOnDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const purchaseAddOn = useAppStore((s) => s.purchaseAddOn);
  const [loading, setLoading] = useState(false);

  const addOn = getAddOnById(id ?? '');
  if (!addOn) return <Text>Add-on not found</Text>;

  const handlePurchase = async () => {
    setLoading(true);
    await purchaseAddOn(addOn.id);
    setLoading(false);
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: locale === 'fr' ? addOn.nameFr : addOn.nameEn, headerShown: true }} />
      <ScrollView style={{ flex: 1, backgroundColor: colors.gray }} contentContainerStyle={{ padding: spacing.md }}>
        <Card>
          <Badge label={t(`addons.categories.${addOn.category}`)} />
          <Text style={{ fontSize: 24, fontWeight: '800', marginTop: spacing.md }}>
            {locale === 'fr' ? addOn.nameFr : addOn.nameEn}
          </Text>
          <Text style={{ color: colors.grayDark, marginTop: spacing.sm }}>
            {locale === 'fr' ? addOn.descriptionFr : addOn.descriptionEn}
          </Text>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.green, marginTop: spacing.lg }}>
            {formatCurrency(addOn.price, locale)}
          </Text>
          {addOn.destinations ? (
            <Text style={{ marginTop: spacing.sm, color: colors.grayDark }}>
              {addOn.destinations.join(', ')}
            </Text>
          ) : null}
        </Card>
        <View style={{ marginTop: spacing.lg }}>
          <Button title={t('addons.purchase')} onPress={handlePurchase} loading={loading} />
        </View>
      </ScrollView>
    </>
  );
}
