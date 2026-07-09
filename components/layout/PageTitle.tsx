import { View, Text, type StyleProp, type TextStyle } from 'react-native';
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
  trailing,
  titleStyle,
}: {
  children?: React.ReactNode;
  backgroundColor?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  titleStyle?: StyleProp<TextStyle>;
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
          // Match auth Back spacing (AuthScreenShell md + previous sm ≈ lg).
          paddingTop: leading ? spacing.lg : hasTitle ? spacing.xl : spacing.lg,
          paddingBottom: hasTitle ? spacing.lg + PAGE_TITLE_FADE_HEIGHT : spacing.md + PAGE_TITLE_FADE_HEIGHT,
        }}>
        {leading}
        {hasTitle ? (
          trailing ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: spacing.sm,
              }}>
              <Text style={[{ ...typography.pageTitle, flex: 1 }, titleStyle]}>{children}</Text>
              {trailing}
            </View>
          ) : (
            <Text style={[{ ...typography.pageTitle }, titleStyle]}>{children}</Text>
          )
        ) : null}
      </LinearGradient>
    </View>
  );
}
