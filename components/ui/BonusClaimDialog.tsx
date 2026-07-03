import { Modal, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { colors, radius, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type BonusClaimDialogProps = {
  visible: boolean;
  gb: number;
  onClose: () => void;
};

export function BonusClaimDialog({ visible, gb, onClose }: BonusClaimDialogProps) {
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
            maxWidth: 340,
            alignItems: 'center',
          }}>
          <Text style={{ fontSize: 40, marginBottom: spacing.sm }}>🎉</Text>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 22,
              color: colors.primary,
              textAlign: 'center',
              marginBottom: spacing.sm,
            }}>
            {t('dashboard.bonusClaimedTitle')}
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
            {t('dashboard.bonusClaimedMessage', { gb })}
          </Text>
          <Button title={t('dashboard.bonusClaimedCta')} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
