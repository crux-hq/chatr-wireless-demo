import { useEffect } from 'react';
import { Platform, Text, View } from 'react-native';
import { CircleCheck } from 'lucide-react-native';
import { colors, radius, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type ToastProps = {
  message: string;
  visible: boolean;
  onHide: () => void;
  durationMs?: number;
};

export function Toast({ message, visible, onHide, durationMs = 3200 }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onHide, durationMs);
    return () => clearTimeout(timer);
  }, [visible, onHide, durationMs]);

  if (!visible) return null;

  return (
    <View
      pointerEvents="none"
      style={{
        position: Platform.OS === 'web' ? ('fixed' as const) : 'absolute',
        left: spacing.lg,
        right: spacing.lg,
        bottom: spacing.xl,
        zIndex: 1000,
        alignItems: 'center',
      }}>
      <View
        style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: colors.primary,
          borderRadius: radius.lg,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          shadowColor: colors.primaryCharcoal,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.18,
          shadowRadius: 12,
          elevation: 6,
        }}>
        <CircleCheck color={colors.accent} size={22} />
        <Text style={{ flex: 1, fontFamily: fonts.semiBold, fontSize: 16, lineHeight: 22, color: colors.white }}>
          {message}
        </Text>
      </View>
    </View>
  );
}
