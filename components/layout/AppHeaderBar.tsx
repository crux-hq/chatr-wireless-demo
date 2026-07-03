import { View, Pressable, StyleSheet } from 'react-native';
import { Menu } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatrLogoLink } from '@/components/ui/ChatrLogo';
import { colors, spacing } from '@/lib/theme/colors';

export const APP_HEADER_HEIGHT = 72;

export const headerShadowStyle = {
  shadowColor: colors.primaryCharcoal,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
};

type AppHeaderBarProps = {
  onMenuPress?: () => void;
  showShadow?: boolean;
  trailing?: React.ReactNode;
};

export function AppHeaderBar({ onMenuPress, showShadow = true, trailing }: AppHeaderBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          height: insets.top + APP_HEADER_HEIGHT,
          paddingTop: insets.top,
          paddingHorizontal: spacing.lg,
        },
        showShadow ? headerShadowStyle : null,
      ]}>
      <ChatrLogoLink />
      {trailing ?? (
        <Pressable
          onPress={onMenuPress}
          accessibilityLabel="Open menu"
          style={styles.menuButton}>
          <Menu color={colors.primary} size={26} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
