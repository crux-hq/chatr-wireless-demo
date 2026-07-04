import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Plan } from '@/lib/mock/types';
import { getPlanDetailContent } from '@/lib/mock/plan-details';
import { Card, SectionTitle } from '@/components/ui/Button';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type PlanDetailSectionsProps = {
  plan: Plan;
  locale: 'en' | 'fr';
};

function DetailRow({ title, body }: { title: string; body: string }) {
  return (
    <View style={{ marginTop: spacing.md }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.text }}>{title}</Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 15, color: colors.grayDark, marginTop: spacing.xs, lineHeight: 22 }}>
        {body}
      </Text>
    </View>
  );
}

export function PlanDetailSections({ plan, locale }: PlanDetailSectionsProps) {
  const { t } = useTranslation();
  const content = getPlanDetailContent(plan.id);
  if (!content) return null;

  const promo = locale === 'fr' ? content.promoFr : content.promoEn;

  return (
    <>
      {promo ? (
        <Card style={{ marginTop: spacing.md, backgroundColor: colors.lavenderMid }}>
          <Text style={{ fontFamily: fonts.semiBold, color: colors.primary, lineHeight: 22 }}>{promo}</Text>
        </Card>
      ) : null}

      <SectionTitle style={{ marginTop: spacing.lg }}>{t('plans.whatsIncluded')}</SectionTitle>
      <Card>
        {content.details.map((item, index) => (
          <View key={`${item.titleEn}-${index}`} style={{ marginTop: index === 0 ? 0 : spacing.md }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.text }}>
              {locale === 'fr' ? item.titleFr : item.titleEn}
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 15,
                color: colors.grayDark,
                marginTop: spacing.xs,
                lineHeight: 22,
              }}>
              {locale === 'fr' ? item.textFr : item.textEn}
            </Text>
          </View>
        ))}
      </Card>

      <SectionTitle style={{ marginTop: spacing.lg }}>{t('plans.allPlansInclude')}</SectionTitle>
      <Card>
        <Text style={{ fontFamily: fonts.regular, fontSize: 15, color: colors.grayDark, lineHeight: 22 }}>
          {t('plans.allPlansIncludeBody')}
        </Text>
      </Card>

      {plan.autoPayBonusGb > 0 ? (
        <>
          <SectionTitle style={{ marginTop: spacing.lg }}>{t('plans.autoPayBonusTitle')}</SectionTitle>
          <Card>
            <Text style={{ fontFamily: fonts.regular, fontSize: 15, color: colors.grayDark, lineHeight: 22 }}>
              {t('plans.autoPayBonusBody', { gb: plan.autoPayBonusGb })}
            </Text>
          </Card>
        </>
      ) : null}

      <Text
        style={{
          fontFamily: fonts.regular,
          fontSize: 13,
          color: colors.textMuted,
          marginTop: spacing.lg,
          lineHeight: 20,
        }}>
        {t('plans.detailDisclaimer')}
      </Text>
    </>
  );
}

export function PlanDataBreakdown({ plan }: { plan: Plan; locale: 'en' | 'fr' }) {
  const { t } = useTranslation();
  const totalGb = plan.baseDataGb + plan.autoPayBonusGb;

  return (
    <Card style={{ marginTop: spacing.lg }}>
      <DetailRow title={t('plans.basePlan')} body={`${plan.baseDataGb} GB`} />
      {plan.autoPayBonusGb > 0 ? (
        <DetailRow title={t('plans.autoPayBonusData')} body={`+${plan.autoPayBonusGb} GB`} />
      ) : null}
      {plan.autoPayBonusGb > 0 ? (
        <DetailRow title={t('plans.totalData')} body={`${totalGb} GB`} />
      ) : null}
    </Card>
  );
}
