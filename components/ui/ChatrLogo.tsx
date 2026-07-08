import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import ChattrLogoSvg from '@/assets/images/chattr-logo.svg';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/theme/colors';

type ChatrLogoProps = {
  width?: number;
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
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  return (
    <Pressable
      onPress={() => {
        onNavigate?.();
        router.replace(isAuthenticated ? '/(tabs)' : '/(auth)');
      }}
      accessibilityRole="link"
      accessibilityLabel="Go to home">
      <ChatrLogo {...props} />
    </Pressable>
  );
}
