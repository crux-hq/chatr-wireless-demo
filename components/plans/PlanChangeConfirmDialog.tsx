import { Modal, View, Text, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { Plan } from '@/lib/mock/types';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/i18n';
import { getTotalDataGb } from '@/lib/mock/plans';
import { colors, radius, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type PlanChangeConfirmDialogProps = {
  visible: boolean;
  plan: Plan;
  currentPlan?: Plan | null;
  effectiveDate: string;
  locale: 'en' | 'fr';
  autoPayEnabled: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function PlanChangeConfirmDialog({
  visible,
  plan,
  currentPlan,
  effectiveDate,
  locale,
  autoPayEnabled,
  loading,
  onClose,
  onConfirm,
}: PlanChangeConfirmDialogProps) {
  const { t } = useTranslation();
  const planName = locale === 'fr' ? plan.nameFr : plan.nameEn;
  const currentPlanName = currentPlan ? (locale === 'fr' ? currentPlan.nameFr : currentPlan.nameEn) : '';
  const totalGb = getTotalDataGb(plan, autoPayEnabled);
  const priceSuffix = plan.billingPeriod === 'yearly' ? t('common.perYear') : t('common.perMonth');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.45)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: spacing.lg,
        }}>
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: radius.lg,
            padding: spacing.xl,
            width: '100%',
            maxWidth: 400,
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: colors.text, flex: 1, paddingRight: spacing.md }}>
              {t('plans.changeConfirm')}
            </Text>
            <Pressable onPress={onClose} hitSlop={12} accessibilityLabel={t('common.close')}>
              <X color={colors.textMuted} size={22} />
            </Pressable>
          </View>

          {currentPlan ? (
            <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.grayDark, marginTop: spacing.md }}>
              {t('plans.confirmChangeFrom', { plan: currentPlanName })}
            </Text>
          ) : null}
          <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.primary, marginTop: spacing.sm }}>
            {planName}
          </Text>
          {plan.baseDataGb > 0 ? (
            <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.grayDark, marginTop: spacing.xs }}>
              {t('plans.confirmChangeData', { gb: totalGb })}
            </Text>
          ) : null}
          <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.grayDark, marginTop: spacing.xs }}>
            {t('plans.confirmChangePrice', {
              price: `${formatCurrency(plan.price, locale)}${priceSuffix}`,
            })}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted, marginTop: spacing.md, lineHeight: 22 }}>
            {t('plans.changeEffective', { date: formatDate(effectiveDate, locale) })}
          </Text>

          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
            <View style={{ flex: 1 }}>
              <Button title={t('common.cancel')} onPress={onClose} variant="outline" disabled={loading} />
            </View>
            <View style={{ flex: 1 }}>
              <Button title={t('common.confirm')} onPress={onConfirm} loading={loading} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
