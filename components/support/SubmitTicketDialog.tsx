import { Modal, View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type SubmitTicketDialogProps = {
  visible: boolean;
  onClose: () => void;
};

export function SubmitTicketDialog({ visible, onClose }: SubmitTicketDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(45, 38, 59, 0.5)',
          justifyContent: 'center',
          padding: spacing.lg,
        }}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: colors.white,
            borderRadius: radius.lg,
            padding: spacing.lg,
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={{ fontFamily: fonts.extraBold, fontSize: 20, flex: 1, paddingRight: spacing.sm }}>
              {t('support.ticketTitle')}
            </Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={22} color={colors.textMuted} />
            </Pressable>
          </View>
          <Text style={{ color: colors.grayDark, marginTop: spacing.md, lineHeight: 22 }}>
            {t('support.ticketBody')}
          </Text>
          <View style={{ marginTop: spacing.lg }}>
            <Button title={t('common.close')} onPress={onClose} variant="secondary" />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
