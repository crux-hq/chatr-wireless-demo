import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import type { Plan } from '@/lib/mock/types';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/i18n';
import { startPlanCheckoutAndNavigate } from '@/lib/nav-public';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';
import { Badge, Button } from '@/components/ui/Button';
import { getPlanHighlight, PlanHighlightRibbon } from '@/components/plans/PlanHighlightRibbon';
import { PlanInclusions } from '@/components/plans/PlanInclusions';

type PlanCardProps = {
  plan: Plan;
  isCurrent?: boolean;
  onSelect?: () => void;
  showBuyActions?: boolean;
};

export function PlanCard({ plan, isCurrent, onSelect, showBuyActions }: PlanCardProps) {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const totalGb = plan.baseDataGb + plan.autoPayBonusGb;
  const highlight = getPlanHighlight(plan);
  const isBestDeal = highlight === 'best-deal';
  const isYearly = highlight === 'yearly';
  const isYearlyBilling = plan.billingPeriod === 'yearly';

  return (
    <View
      style={{
        borderRadius: radius.lg,
        marginBottom: spacing.md,
        borderWidth: highlight ? 2 : 1,
        borderColor: isBestDeal ? colors.primary : isYearly ? colors.accent : colors.grayMid,
        backgroundColor: isBestDeal ? colors.lavenderLight : colors.surfaceElevated,
        overflow: 'hidden',
        shadowColor: colors.primaryCharcoal,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: highlight ? 0.12 : 0.06,
        shadowRadius: 10,
        elevation: highlight ? 4 : 2,
      }}>
      {highlight ? <PlanHighlightRibbon highlight={highlight} /> : null}
      <Pressable
        onPress={() => {
          if (onSelect) onSelect();
          else router.push(`/plan/${plan.id}`);
        }}>
        <View style={{ padding: spacing.lg }}>
          {isCurrent ? <Badge label={t('plans.currentPlan')} color={colors.primary} /> : null}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              gap: spacing.md,
              marginTop: isCurrent ? spacing.sm : 0,
            }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 32, color: colors.primary, flexShrink: 0 }}>
              {formatCurrency(plan.price, locale)}
              <Text style={{ fontSize: 16, fontFamily: fonts.regular, color: colors.textMuted }}>
                {isYearlyBilling ? t('common.perYear') : t('common.perMonth')}
              </Text>
            </Text>
            {plan.baseDataGb > 0 ? (
              <Text style={{ fontFamily: fonts.bold, fontSize: 32, color: colors.text }}>
                {totalGb}
                <Text style={{ fontSize: 16, fontFamily: fonts.regular, color: colors.textMuted }}> GB</Text>
              </Text>
            ) : null}
          </View>
          {plan.baseDataGb > 0 && plan.autoPayBonusGb > 0 ? (
            <Text style={{ color: colors.primary, fontSize: 16, marginTop: 4, fontFamily: fonts.bold }}>
              {t('plans.includesAutoPayBonus', { gb: plan.autoPayBonusGb })}
            </Text>
          ) : null}
          <PlanInclusions plan={plan} />
        </View>
      </Pressable>
      {showBuyActions ? (
        <View style={{ padding: spacing.lg, paddingTop: 0 }}>
          <Pressable onPress={() => router.push(`/plan/${plan.id}`)} style={{ marginBottom: spacing.md }}>
            <Text style={{ color: colors.primary, fontFamily: fonts.semiBold, fontSize: 16 }}>{t('plans.viewDetails')}</Text>
          </Pressable>
          <Button title={t('plans.getPlan')} onPress={() => startPlanCheckoutAndNavigate(plan.id)} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}

export function PlanFilter({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { key: string; label: string }[];
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg }}>
      {options.map((opt) => (
        <Pressable
          key={opt.key}
          onPress={() => onChange(opt.key)}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: radius.pill,
            backgroundColor: value === opt.key ? colors.primary : colors.surfaceElevated,
            borderWidth: value === opt.key ? 0 : 1,
            borderColor: colors.grayMid,
          }}>
          <Text
            style={{
              color: value === opt.key ? colors.white : colors.text,
              fontFamily: fonts.semiBold,
            }}>
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
