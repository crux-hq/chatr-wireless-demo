import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Plan, SimType } from '@/lib/mock/types';
import { getTotalDataGb } from '@/lib/mock/plans';
import { ESIM_PRODUCT, SIM_PRODUCT } from '@/lib/mock/sim-product';
import { isSimOnlyCheckout, type CheckoutMode } from '@/lib/checkout';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/i18n';
import { Card } from '@/components/ui/Button';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type CheckoutOrderSummaryProps = {
  checkoutMode: CheckoutMode;
  plan?: Plan | null;
  simType?: SimType | null;
};

export function CheckoutOrderSummary({ checkoutMode, plan, simType }: CheckoutOrderSummaryProps) {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const autoPay = useAppStore((s) => s.activationDraft.autoPay);

  if (isSimOnlyCheckout(checkoutMode)) {
    const product = simType === 'physical-order' ? SIM_PRODUCT : ESIM_PRODUCT;
    const name = locale === 'fr' ? product.nameFr : product.nameEn;
    const tag = locale === 'fr' ? product.tagFr : product.tagEn;
    const price = simType === 'physical-order' ? SIM_PRODUCT.price : ESIM_PRODUCT.price;

    return (
      <Card style={{ padding: spacing.lg, marginBottom: spacing.lg }}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 18, marginBottom: spacing.md }}>{t('checkout.orderSummary')}</Text>
        <Text style={{ fontFamily: fonts.semiBold, fontSize: 16, color: colors.text }}>{name}</Text>
        <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, marginTop: 4 }}>{tag}</Text>
        {simType === 'physical-order' ? (
          <Text style={{ fontFamily: fonts.regular, color: colors.primary, marginTop: spacing.sm }}>
            {t('checkout.simFreeShipping')}
          </Text>
        ) : (
          <Text style={{ fontFamily: fonts.regular, color: colors.primary, marginTop: spacing.sm }}>
            {t('buySim.instantAccess')}
          </Text>
        )}
        <View style={{ height: 1, backgroundColor: colors.grayMid, marginVertical: spacing.md }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.semiBold }}>{t('checkout.totalDueToday')}</Text>
          <Text style={{ fontFamily: fonts.extraBold, fontSize: 22, color: colors.primary }}>
            {price > 0 ? formatCurrency(price, locale) : t('buySim.free')}
          </Text>
        </View>
      </Card>
    );
  }

  if (!plan) return null;

  const totalGb = getTotalDataGb(plan, autoPay);
  const name = locale === 'fr' ? plan.nameFr : plan.nameEn;
  const isYearly = plan.billingPeriod === 'yearly';

  return (
    <Card style={{ padding: spacing.lg, marginBottom: spacing.lg }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: 18, marginBottom: spacing.md }}>{t('checkout.orderSummary')}</Text>
      <Text style={{ fontFamily: fonts.semiBold, fontSize: 16, color: colors.text }}>
        {plan.baseDataGb > 0 ? `${totalGb} GB` : name}
      </Text>
      <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, marginTop: 4 }}>{name}</Text>
      {plan.autoPayBonusGb > 0 && autoPay ? (
        <Text style={{ fontFamily: fonts.regular, color: colors.primary, marginTop: spacing.sm }}>
          {t('checkout.autoPayBonus', { gb: plan.autoPayBonusGb })}
        </Text>
      ) : null}
      <View style={{ height: 1, backgroundColor: colors.grayMid, marginVertical: spacing.md }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontFamily: fonts.semiBold }}>{t('checkout.totalDueToday')}</Text>
        <Text style={{ fontFamily: fonts.extraBold, fontSize: 22, color: colors.primary }}>
          {formatCurrency(plan.price, locale)}
          {!isYearly ? t('common.perMonth') : t('common.perYear')}
        </Text>
      </View>
    </Card>
  );
}
