import { View, Pressable } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import ChattrLogoSvg from '@/assets/images/chattr-logo.svg';
import { colors } from '@/lib/theme/colors';

type ChatrLogoProps = {
  width?: number;
  variant?: 'light' | 'dark';
};

const LOGO_ASPECT = 107 / 50;

function isPublicPage(segments: string[]) {
  const root = segments[0];
  return root === 'home' || root === '(auth)' || root === 'activate' || root === 'demo';
}

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
  const segments = useSegments();

  if (!isPublicPage(segments)) {
    return <ChatrLogo {...props} />;
  }

  return (
    <Pressable
      onPress={() => {
        onNavigate?.();
        router.replace('/home');
      }}
      accessibilityRole="link"
      accessibilityLabel="Go to homepage">
      <ChatrLogo {...props} />
    </Pressable>
  );
}
