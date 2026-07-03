import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { CoverageSearchResult } from '@/lib/mock/coverage';
import { useAppStore } from '@/lib/store';
import { Card, Badge } from '@/components/ui/Button';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type CoverageResultCardProps = {
  result: CoverageSearchResult;
};

export function CoverageResultCard({ result }: CoverageResultCardProps) {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const label = locale === 'fr' ? result.labelFr : result.labelEn;

  return (
    <Card style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
      <Text style={{ fontFamily: fonts.extraBold, fontSize: 17, marginBottom: spacing.sm }}>{label}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
        {result.nationWide ? (
          <Badge label={t('coverage.filterNationWide')} color={colors.primary} />
        ) : (
          <Badge label={t('coverage.notAvailable')} color={colors.grayDark} />
        )}
        {result.extended ? <Badge label={t('coverage.filterExtended')} color={colors.primaryLight} /> : null}
        {result.inZone ? <Badge label={t('coverage.filterInZone')} color={colors.warning} /> : null}
      </View>
      {!result.nationWide && !result.extended ? (
        <Text style={{ color: colors.grayDark, marginTop: spacing.sm, lineHeight: 20 }}>
          {t('coverage.noCoverageMessage')}
        </Text>
      ) : null}
    </Card>
  );
}
