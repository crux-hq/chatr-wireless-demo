import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import type { Plan } from '@/lib/mock/types';
import { useAppStore, useLocalizedPlan } from '@/lib/store';
import { formatCurrency } from '@/lib/i18n';
import { colors, spacing } from '@/lib/theme/colors';
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
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: plan.featured ? 2 : 1,
        borderColor: plan.featured ? colors.green : colors.grayMid,
      }}>
      {plan.featured ? <Badge label="Featured" color={colors.green} /> : null}
      {isCurrent ? (
        <View style={{ marginTop: plan.featured ? 8 : 0 }}>
          <Badge label="Current" color={colors.greenDark} />
        </View>
      ) : null}
      <Text style={{ fontSize: 32, fontWeight: '800', color: colors.black, marginTop: 8 }}>
        {plan.baseDataGb > 0 ? `${totalGb} GB` : name}
      </Text>
      {plan.baseDataGb > 0 ? (
        <Text style={{ color: colors.grayDark, fontSize: 13, marginTop: 4 }}>
          {plan.baseDataGb} GB base + {plan.autoPayBonusGb} GB Auto-Pay
        </Text>
      ) : null}
      <Text style={{ fontSize: 24, fontWeight: '700', color: colors.green, marginTop: 8 }}>
        {formatCurrency(plan.price, locale)}
        <Text style={{ fontSize: 14, fontWeight: '400' }}>/mo</Text>
      </Text>
      <Text style={{ color: colors.black, marginTop: 8 }}>{talk}</Text>
      <Text style={{ color: colors.black, marginTop: 4 }}>{text}</Text>
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
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md }}>
      {options.map((opt) => (
        <Pressable
          key={opt.key}
          onPress={() => onChange(opt.key)}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: value === opt.key ? colors.green : colors.gray,
          }}>
          <Text style={{ color: value === opt.key ? colors.white : colors.black, fontWeight: '600' }}>
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
