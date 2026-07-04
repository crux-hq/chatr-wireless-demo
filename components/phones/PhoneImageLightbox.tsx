import { Modal, View, Image, Pressable, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react-native';
import type { Phone } from '@/lib/mock/types';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type PhoneImageLightboxProps = {
  visible: boolean;
  phone: Phone;
  onClose: () => void;
};

export function PhoneImageLightbox({ visible, phone, onClose }: PhoneImageLightboxProps) {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const name = locale === 'fr' ? phone.nameFr : phone.nameEn;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(15, 10, 25, 0.94)' }}>
        <Pressable accessibilityLabel={t('common.close')} onPress={onClose} style={StyleSheet.absoluteFill} />

        <Pressable
          onPress={onClose}
          accessibilityLabel={t('common.close')}
          style={{ position: 'absolute', top: spacing.lg, right: spacing.lg, zIndex: 2, padding: spacing.sm }}>
          <X size={28} color={colors.white} />
        </Pressable>

        <View
          pointerEvents="box-none"
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.xxl,
          }}>
          <Image
            source={phone.image}
            accessibilityLabel={name}
            style={{ width: '100%', height: '85%', maxWidth: 560 }}
            resizeMode="contain"
          />
          <Text style={{ color: colors.white, fontFamily: fonts.semiBold, textAlign: 'center', marginTop: spacing.md }}>
            {name}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
