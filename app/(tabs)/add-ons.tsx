import { ScrollView, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/layout/Header';
import { Card, Badge } from '@/components/ui/Button';
import { ADD_ONS, ADD_ON_CATEGORY_LABELS } from '@/lib/mock/add-ons';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/i18n';
import { colors, spacing } from '@/lib/theme/colors';
import type { AddOnCategory } from '@/lib/mock/types';

export default function AddOnsScreen() {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);

  const categories = Object.keys(ADD_ON_CATEGORY_LABELS) as AddOnCategory[];

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header title={t('addons.title')} />
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={{ color: colors.grayDark, marginBottom: spacing.lg }}>{t('addons.subtitle')}</Text>

        {categories.map((cat) => {
          const items = ADD_ONS.filter((a) => a.category === cat);
          const catLabel = ADD_ON_CATEGORY_LABELS[cat];
          return (
            <View key={cat} style={{ marginBottom: spacing.lg }}>
              <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: spacing.sm }}>
                {t(`addons.categories.${cat}`)}
              </Text>
              {items.map((addOn) => (
                <Pressable key={addOn.id} onPress={() => router.push(`/addons/${addOn.id}`)}>
                  <Card style={{ marginBottom: spacing.sm }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '700', fontSize: 16 }}>
                          {locale === 'fr' ? addOn.nameFr : addOn.nameEn}
                        </Text>
                        <Text style={{ color: colors.grayDark, marginTop: 4, fontSize: 16 }}>
                          {locale === 'fr' ? addOn.descriptionFr : addOn.descriptionEn}
                        </Text>
                        {addOn.dataGb ? (
                          <Badge label={`${addOn.dataGb} GB`} color={colors.greenDark} />
                        ) : null}
                      </View>
                      <Text style={{ fontWeight: '800', color: colors.green, fontSize: 18 }}>
                        {formatCurrency(addOn.price, locale)}
                      </Text>
                    </View>
                  </Card>
                </Pressable>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
