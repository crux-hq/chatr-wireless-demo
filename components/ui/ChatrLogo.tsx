import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type ChatrLogoProps = {
  height?: number;
  /** Use light (white) wordmark for purple/dark backgrounds */
  variant?: 'light' | 'dark';
};

export function ChatrLogo({ height = 30, variant = 'light' }: ChatrLogoProps) {
  const scale = height / 36;
  const wordmarkColor = variant === 'light' ? colors.white : colors.primary;

  return (
    <View style={{ height, justifyContent: 'center' }} accessibilityLabel="chatr">
      <Text
        style={{
          fontFamily: fonts.extraBold,
          fontSize: 22 * scale,
          lineHeight: 24 * scale,
          color: wordmarkColor,
          letterSpacing: -0.5,
          textTransform: 'lowercase',
        }}>
        chatr
      </Text>
      <Text
        style={{
          fontFamily: fonts.bold,
          fontSize: 7.5 * scale,
          lineHeight: 9 * scale,
          color: colors.accent,
          letterSpacing: 1.8,
          marginTop: -1 * scale,
        }}>
        MOBILE
      </Text>
    </View>
  );
}
