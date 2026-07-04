import { View, Image, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/Button';
import type { Phone } from '@/lib/mock/types';
import { colors, spacing } from '@/lib/theme/colors';

type PhoneImageProps = {
  phone: Phone;
  height?: number;
  badgePosition?: 'left' | 'right';
  onPress?: () => void;
};

export function PhoneImage({ phone, height = 180, badgePosition = 'left', onPress }: PhoneImageProps) {
  const { t } = useTranslation();

  const content = (
    <>
      <Image source={phone.image} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
      {phone.voLTE ? (
        <View
          style={{
            position: 'absolute',
            top: spacing.sm,
            ...(badgePosition === 'right' ? { right: spacing.sm } : { left: spacing.sm }),
          }}>
          <Badge label={t('phones.voLTE')} color={colors.primary} />
        </View>
      ) : null}
    </>
  );

  const containerStyle = {
    height,
    backgroundColor: colors.lavenderLight,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: spacing.md,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={t('phones.viewLargerImage')}
        style={({ pressed }) => [containerStyle, pressed ? { opacity: 0.92 } : null]}>
        {content}
      </Pressable>
    );
  }

  return <View style={containerStyle}>{content}</View>;
}
