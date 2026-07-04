import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Plan } from '@/lib/mock/types';
import { useLocalizedPlan } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type PlanInclusionsProps = {
  plan: Plan;
};

const inclusionTextStyle = {
  color: colors.text,
  marginTop: 4,
  fontFamily: fonts.regular,
  lineHeight: 22,
} as const;

export function PlanInclusions({ plan }: PlanInclusionsProps) {
  const { t } = useTranslation();
  const { talk, text } = useLocalizedPlan(plan);

  return (
    <>
      <Text style={{ ...inclusionTextStyle, marginTop: spacing.sm }}>{talk}</Text>
      <Text style={inclusionTextStyle}>{text}</Text>
      <Text style={inclusionTextStyle}>{t('plans.voicemailIncluded')}</Text>
    </>
  );
}
