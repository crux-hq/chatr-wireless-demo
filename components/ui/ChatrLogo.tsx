import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import ChattrLogoSvg from '@/assets/images/chattr-logo.svg';
import { colors } from '@/lib/theme/colors';

type ChatrLogoProps = {
  width?: number;
  variant?: 'light' | 'dark';
};

const LOGO_ASPECT = 107 / 50;

export function ChatrLogo({ width = 94 }: ChatrLogoProps) {
  const height = width / LOGO_ASPECT;

  return (
    <View style={{ width, height, justifyContent: 'center' }} accessibilityLabel="chatr">
      <ChattrLogoSvg width={width} height={height} color={colors.primary} />
    </View>
  );
}

export function ChatrLogoLink({ onNavigate, ...props }: ChatrLogoProps & { onNavigate?: () => void }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        onNavigate?.();
        router.replace('/');
      }}
      accessibilityRole="link"
      accessibilityLabel="Go to home">
      <ChatrLogo {...props} />
    </Pressable>
  );
}
