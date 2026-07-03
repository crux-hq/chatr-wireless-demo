import { Modal, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { colors, radius, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type SimOrderSuccessDialogProps = {
  visible: boolean;
  onClose: () => void;
  onActivate: () => void;
  onBrowsePlans: () => void;
};

export function SimOrderSuccessDialog({
  visible,
  onClose,
  onActivate,
  onBrowsePlans,
}: SimOrderSuccessDialogProps) {
  const { t } = useTranslation();

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
            {t('buySim.orderSuccess')}
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
            {t('buySim.orderSuccessDesc')}
          </Text>
          <View style={{ width: '100%', gap: spacing.sm }}>
            <Button title={t('buySim.activateWhenReady')} onPress={onActivate} />
            <Button title={t('buySim.browsePlans')} onPress={onBrowsePlans} variant="secondary" />
            <Button title={t('common.close')} onPress={onClose} variant="outline" />
          </View>
        </View>
      </View>
    </Modal>
  );
}
