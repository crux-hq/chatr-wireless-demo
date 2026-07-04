import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { PlanHighlight } from '@/lib/mock/types';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export function getPlanHighlight(plan: { highlight?: PlanHighlight; featured?: boolean }): PlanHighlight | undefined {
  return plan.highlight ?? (plan.featured ? 'best-deal' : undefined);
}

type PlanHighlightRibbonProps = {
  highlight: PlanHighlight;
};

export function PlanHighlightRibbon({ highlight }: PlanHighlightRibbonProps) {
  const { t } = useTranslation();
  const isBestDeal = highlight === 'best-deal';

  return (
    <View
      style={{
        backgroundColor: isBestDeal ? colors.primary : colors.accent,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontFamily: fonts.bold,
          fontSize: 13,
          color: isBestDeal ? colors.white : colors.textOnAccent,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        }}>
        {isBestDeal ? t('plans.bestDeal') : t('plans.yearlyPlan')}
      </Text>
    </View>
  );
}
