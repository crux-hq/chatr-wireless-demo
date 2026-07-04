import { Text } from 'react-native';
import type { Plan } from '@/lib/mock/types';
import { useLocalizedPlan } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type PlanInclusionsProps = {
  plan: Plan;
};

export function PlanInclusions({ plan }: PlanInclusionsProps) {
  const { talk, text } = useLocalizedPlan(plan);

  return (
    <>
      <Text style={{ color: colors.text, marginTop: spacing.sm, fontFamily: fonts.regular, lineHeight: 22 }}>{talk}</Text>
      <Text style={{ color: colors.text, marginTop: 4, fontFamily: fonts.regular, lineHeight: 22 }}>{text}</Text>
    </>
  );
}
