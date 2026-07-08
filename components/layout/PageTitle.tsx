import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '@/lib/theme/colors';
import { typography } from '@/lib/theme/typography';

export const PAGE_TITLE_FADE_HEIGHT = 32;

function fadeEndColor(backgroundColor: string) {
  if (backgroundColor === colors.white) return 'rgba(255, 255, 255, 0)';
  return 'rgba(243, 240, 255, 0)';
}

export function PageTitle({
  children,
  backgroundColor = colors.gray,
  leading,
}: {
  children?: React.ReactNode;
  backgroundColor?: string;
  leading?: React.ReactNode;
}) {
  const hasTitle = children != null && children !== '';

  return (
    <View
      pointerEvents="box-none"
      style={{
        zIndex: 2,
        marginBottom: spacing.lg - PAGE_TITLE_FADE_HEIGHT,
      }}>
      <LinearGradient
        colors={[backgroundColor, backgroundColor, fadeEndColor(backgroundColor)]}
        locations={[0, 0.42, 1]}
        pointerEvents="box-none"
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: leading ? spacing.sm : hasTitle ? spacing.xl : spacing.lg,
          paddingBottom: hasTitle ? spacing.lg + PAGE_TITLE_FADE_HEIGHT : spacing.md + PAGE_TITLE_FADE_HEIGHT,
        }}>
        {leading}
        {hasTitle ? <Text style={{ ...typography.pageTitle }}>{children}</Text> : null}
      </LinearGradient>
    </View>
  );
}
