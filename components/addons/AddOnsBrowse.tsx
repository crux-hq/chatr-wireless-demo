import { ScrollView, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { PageSubtitle } from '@/components/layout/PageSubtitle';
import { Card, Badge } from '@/components/ui/Button';
import { ADD_ONS, ADD_ON_CATEGORY_LABELS } from '@/lib/mock/add-ons';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/i18n';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';
import type { AddOnCategory } from '@/lib/mock/types';

type AddOnsBrowseProps = {
  variant?: 'authenticated' | 'public';
};

export function AddOnsBrowse({ variant = 'authenticated' }: AddOnsBrowseProps) {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const categories = Object.keys(ADD_ON_CATEGORY_LABELS) as AddOnCategory[];

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('addons.title')}</PageTitle>
      <PageScrollView
        contentContainerStyle={{
          padding: spacing.md,
          paddingBottom: variant === 'public' ? 100 : spacing.md,
        }}>
        <PageSubtitle style={{ marginBottom: spacing.lg }}>{t('addons.subtitle')}</PageSubtitle>

        {categories.map((cat) => {
          const items = ADD_ONS.filter((a) => a.category === cat);
          return (
            <View key={cat} style={{ marginBottom: spacing.lg }}>
              <Text style={{ fontFamily: fonts.extraBold, fontSize: 18, marginBottom: spacing.sm }}>
                {t(`addons.categories.${cat}`)}
              </Text>
              {items.map((addOn) => (
                <Pressable key={addOn.id} onPress={() => router.push(`/addons/${addOn.id}`)}>
                  <Card style={{ marginBottom: spacing.sm }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1, paddingRight: spacing.sm }}>
                        <Text style={{ fontFamily: fonts.bold, fontSize: 16, marginBottom: spacing.sm }}>
                          {locale === 'fr' ? addOn.nameFr : addOn.nameEn}
                        </Text>
                        <Text
                          style={{
                            fontFamily: fonts.regular,
                            color: colors.grayDark,
                            marginBottom: spacing.sm,
                            fontSize: 16,
                          }}>
                          {locale === 'fr' ? addOn.descriptionFr : addOn.descriptionEn}
                        </Text>
                        {addOn.dataGb ? (
                          <Badge label={`${addOn.dataGb} GB`} color={colors.greenDark} />
                        ) : null}
                      </View>
                      <Text style={{ fontFamily: fonts.extraBold, color: colors.green, fontSize: 18 }}>
                        {formatCurrency(addOn.price, locale)}
                      </Text>
                    </View>
                  </Card>
                </Pressable>
              ))}
            </View>
          );
        })}
        {variant === 'public' ? <PublicHomeFooter /> : null}
      </PageScrollView>
    </View>
  );
}
