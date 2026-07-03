import { Modal, View, Text, Pressable, useWindowDimensions } from 'react-native';
import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { colors, radius, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type AddOnSetupDialogProps = {
  visible: boolean;
  onClose: () => void;
  onActivate: () => void;
  onSignIn: () => void;
};

export function AddOnSetupDialog({ visible, onClose, onActivate, onSignIn }: AddOnSetupDialogProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const sideBySide = width >= 520;

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
            maxWidth: 640,
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
              {t('addons.setupTitle')}
            </Text>
            <Pressable onPress={onClose} hitSlop={12} accessibilityLabel={t('common.close')}>
              <X color={colors.textMuted} size={22} />
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: sideBySide ? 'row' : 'column',
              marginTop: spacing.lg,
              gap: spacing.lg,
            }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.text }}>
                {t('addons.setupNewTitle')}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 16,
                  color: colors.grayDark,
                  marginTop: spacing.sm,
                  lineHeight: 24,
                }}>
                {t('addons.setupNewDesc')}
              </Text>
              <View style={{ marginTop: spacing.md }}>
                <Button title={t('addons.setupActivate')} onPress={onActivate} variant="secondary" />
              </View>
            </View>

            {sideBySide ? (
              <View style={{ width: 1, backgroundColor: colors.grayMid }} />
            ) : (
              <View style={{ height: 1, backgroundColor: colors.grayMid }} />
            )}

            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.text }}>
                {t('addons.setupExistingTitle')}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 16,
                  color: colors.grayDark,
                  marginTop: spacing.sm,
                  lineHeight: 24,
                }}>
                {t('addons.setupExistingDesc')}
              </Text>
              <View style={{ marginTop: spacing.md }}>
                <Button title={t('addons.setupSignIn')} onPress={onSignIn} variant="secondary" />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
