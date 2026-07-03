import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import type { Plan } from '@/lib/mock/types';
import { useAppStore, useLocalizedPlan } from '@/lib/store';
import { formatCurrency } from '@/lib/i18n';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';
import { Badge } from '@/components/ui/Button';

type PlanCardProps = {
  plan: Plan;
  isCurrent?: boolean;
  onSelect?: () => void;
};

export function PlanCard({ plan, isCurrent, onSelect }: PlanCardProps) {
  const locale = useAppStore((s) => s.locale);
  const { name, talk, text } = useLocalizedPlan(plan);
  const totalGb = plan.baseDataGb + plan.autoPayBonusGb;

  return (
    <Pressable
      onPress={() => {
        if (onSelect) onSelect();
        else router.push(`/plan/${plan.id}`);
      }}
      style={{
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: plan.featured ? 2 : 1,
        borderColor: plan.featured ? colors.accent : colors.grayMid,
        shadowColor: colors.primaryCharcoal,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: plan.featured ? 0.12 : 0.06,
        shadowRadius: 10,
        elevation: plan.featured ? 4 : 2,
      }}>
      {plan.featured ? <Badge label="Featured" color={colors.accent} /> : null}
      {isCurrent ? (
        <View style={{ marginTop: plan.featured ? 8 : 0 }}>
          <Badge label="Current" color={colors.primary} />
        </View>
      ) : null}
      <Text
        style={{
          fontFamily: fonts.bold,
          fontSize: 32,
          color: colors.text,
          marginTop: 8,
        }}>
        {plan.baseDataGb > 0 ? `${totalGb} GB` : name}
      </Text>
      {plan.baseDataGb > 0 ? (
        <Text style={{ color: colors.textMuted, fontSize: 16, marginTop: 4, fontFamily: fonts.regular }}>
          {plan.baseDataGb} GB base + {plan.autoPayBonusGb} GB Auto-Pay
        </Text>
      ) : null}
      <Text style={{ fontFamily: fonts.bold, fontSize: 26, color: colors.primary, marginTop: spacing.sm }}>
        {formatCurrency(plan.price, locale)}
        <Text style={{ fontSize: 16, fontFamily: fonts.regular, color: colors.textMuted }}>/mo</Text>
      </Text>
      <Text style={{ color: colors.text, marginTop: spacing.sm, fontFamily: fonts.regular }}>{talk}</Text>
      <Text style={{ color: colors.text, marginTop: 4, fontFamily: fonts.regular }}>{text}</Text>
    </Pressable>
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
