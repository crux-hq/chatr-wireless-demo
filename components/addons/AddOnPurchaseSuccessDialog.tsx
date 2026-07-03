import { Modal, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/i18n';
import { colors, radius, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type AddOnPurchaseSuccessDialogProps = {
  visible: boolean;
  addOnName: string;
  expiresAt: string;
  locale: 'en' | 'fr';
  onClose: () => void;
  onViewAccount: () => void;
};

export function AddOnPurchaseSuccessDialog({
  visible,
  addOnName,
  expiresAt,
  locale,
  onClose,
  onViewAccount,
}: AddOnPurchaseSuccessDialogProps) {
  const { t } = useTranslation();

  if (!visible || !expiresAt) return null;

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
            maxWidth: 360,
            alignItems: 'center',
          }}>
          <Text style={{ fontSize: 40, marginBottom: spacing.sm }}>✓</Text>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 22,
              color: colors.primary,
              textAlign: 'center',
              marginBottom: spacing.sm,
            }}>
            {t('addons.purchased')}
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 16,
              color: colors.grayDark,
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: spacing.lg,
            }}>
            {t('addons.purchasedDetail', {
              name: addOnName,
              date: formatDate(expiresAt, locale),
            })}
          </Text>
          <View style={{ width: '100%', gap: spacing.sm }}>
            <Button title={t('addons.viewAccount')} onPress={onViewAccount} />
            <Button title={t('common.close')} onPress={onClose} variant="outline" />
          </View>
        </View>
      </View>
    </Modal>
  );
}
