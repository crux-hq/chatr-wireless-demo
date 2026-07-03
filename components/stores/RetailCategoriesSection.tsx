import { useState } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HomeAccordion } from '@/components/homepage/HomeAccordion';
import { RETAIL_CATEGORY_SAMPLES } from '@/lib/mock/stores';
import { RETAIL_CATEGORIES } from '@/lib/stores/locator';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export function RetailCategoriesSection() {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const items = RETAIL_CATEGORIES.map((category) => {
    const sample = RETAIL_CATEGORY_SAMPLES[category];
    const retailers = locale === 'fr' ? sample.retailersFr : sample.retailersEn;
    return {
      id: category,
      title: locale === 'fr' ? sample.nameFr : sample.nameEn,
      body: retailers.join(' • '),
    };
  });

  return (
    <View style={{ marginTop: spacing.lg }}>
      <Text style={{ fontFamily: fonts.extraBold, fontSize: 18, marginBottom: spacing.md }}>
        {t('stores.topUpRetailTitle')}
      </Text>
      <Text style={{ color: colors.grayDark, marginBottom: spacing.md, lineHeight: 22 }}>
        {t('stores.topUpRetailBody')}
      </Text>
      <HomeAccordion
        items={items}
        expandedId={expandedId}
        onToggle={(id) => setExpandedId(expandedId === id ? null : id)}
      />
    </View>
  );
}
