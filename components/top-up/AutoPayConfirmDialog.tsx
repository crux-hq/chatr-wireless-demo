import { Modal, View, Text, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { colors, radius, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type AutoPayConfirmDialogProps = {
  visible: boolean;
  mode: 'enroll' | 'disable';
  paymentLabel: string | null;
  renewalDate: string;
  bonusGb: number;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function AutoPayConfirmDialog({
  visible,
  mode,
  paymentLabel,
  renewalDate,
  bonusGb,
  loading,
  onClose,
  onConfirm,
}: AutoPayConfirmDialogProps) {
  const { t } = useTranslation();
  const isEnroll = mode === 'enroll';

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
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 22,
                color: colors.text,
                flex: 1,
                paddingRight: spacing.md,
              }}>
              {isEnroll ? t('topUp.confirmEnrollTitle') : t('topUp.confirmDisableTitle')}
            </Text>
            <Pressable onPress={onClose} hitSlop={12} accessibilityLabel={t('common.close')}>
              <X color={colors.textMuted} size={22} />
            </Pressable>
          </View>

          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 15,
              lineHeight: 23,
              color: colors.textMuted,
              marginTop: spacing.md,
            }}>
            {isEnroll
              ? t('topUp.confirmEnrollBody', {
                  date: renewalDate,
                  card: paymentLabel ?? t('topUp.confirmPaymentFallback'),
                })
              : t('topUp.confirmDisableBody', { date: renewalDate })}
          </Text>

          {isEnroll ? (
            <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
              {bonusGb > 0 ? (
                <Text style={{ fontFamily: fonts.semiBold, fontSize: 14, color: colors.primary }}>
                  {t('topUp.confirmBonus', { gb: bonusGb })}
                </Text>
              ) : null}
              <Text style={{ fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.textMuted }}>
                {t('topUp.confirmChangeAnytime')}
              </Text>
            </View>
          ) : null}

          <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
            <Button
              title={isEnroll ? t('topUp.confirmEnrollCta') : t('topUp.confirmDisableCta')}
              onPress={onConfirm}
              loading={loading}
              variant={isEnroll ? 'primary' : 'outline'}
            />
            <Button title={t('common.cancel')} onPress={onClose} variant="ghost" />
          </View>
        </View>
      </View>
    </Modal>
  );
}
