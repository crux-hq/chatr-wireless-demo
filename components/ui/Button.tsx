import { View, Text, Pressable, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors, radius, spacing, sizes } from '@/lib/theme/colors';
import { fonts, typography } from '@/lib/theme/typography';

const getButtonLayout = (size: 'default' | 'compact' = 'default'): ViewStyle => ({
  height: size === 'compact' ? sizes.buttonHeightCompact : sizes.buttonHeight,
  paddingHorizontal: spacing.lg,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: radius.button,
  boxSizing: 'border-box',
});

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'compact';
  loading?: boolean;
  disabled?: boolean;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'default',
  loading,
  disabled,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  const bg = isPrimary ? colors.accent : isSecondary ? colors.primary : 'transparent';
  const textColor = isPrimary
    ? colors.textOnAccent
    : isSecondary
      ? colors.textOnPrimary
      : isOutline || isGhost
        ? colors.accent
        : colors.textOnPrimary;
  const borderWidth = isOutline || isGhost ? 2 : 0;
  const borderColor = isOutline || isGhost ? colors.accent : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={{
        ...getButtonLayout(size),
        backgroundColor: bg,
        borderWidth,
        borderColor,
        opacity: disabled || loading ? 0.6 : 1,
      }}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={{ ...typography.button, color: textColor }}>{title}</Text>
      )}
    </Pressable>
  );
}

type CtaButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  size?: 'default' | 'compact';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function CtaButton({
  title,
  onPress,
  variant = 'primary',
  size = 'default',
  loading,
  style,
}: CtaButtonProps) {
  const isPrimary = variant === 'primary';
  const accentColor = isPrimary ? colors.textOnAccent : colors.accent;

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={[
        {
          ...getButtonLayout(size),
          backgroundColor: isPrimary ? colors.accent : 'transparent',
          borderWidth: isPrimary ? 0 : 2,
          borderColor: colors.accent,
          flexDirection: 'row',
          gap: 4,
          opacity: loading ? 0.7 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={accentColor} />
      ) : (
        <>
          <Text style={{ ...typography.button, color: accentColor }}>{title}</Text>
          <ChevronRight size={16} color={accentColor} />
        </>
      )}
    </Pressable>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return (
    <View
      style={{
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius.lg,
        padding: spacing.lg,
        shadowColor: colors.primaryCharcoal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        ...style,
      }}>
      {children}
    </View>
  );
}

export function Badge({
  label,
  color = colors.primary,
  style,
}: {
  label: string;
  color?: string;
  style?: object;
}) {
  return (
    <View
      style={{
        backgroundColor: color + '22',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: radius.pill,
        alignSelf: 'flex-start',
        flexShrink: 1,
        maxWidth: '100%',
        ...style,
      }}>
      <Text
        style={{ color, fontFamily: fonts.semiBold, fontSize: 12, flexShrink: 1 }}
        numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

export function SectionTitle({ children, style }: { children: string; style?: object }) {
  return (
    <Text
      style={{
        fontFamily: fonts.semiBold,
        fontSize: 18,
        color: colors.text,
        marginBottom: spacing.md,
        ...style,
      }}>
      {children}
    </Text>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </View>
  );
}
