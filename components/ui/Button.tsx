import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { colors, radius, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
};

export function Button({ title, onPress, variant = 'primary', loading, disabled }: ButtonProps) {
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
        ? colors.primary
        : colors.textOnPrimary;
  const borderWidth = isOutline || isGhost ? 2 : 0;
  const borderColor = isGhost ? colors.white : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={{
        backgroundColor: bg,
        borderWidth,
        borderColor,
        borderRadius: radius.pill,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        opacity: disabled || loading ? 0.6 : 1,
      }}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={{ color: textColor, fontFamily: fonts.bold, fontSize: 16 }}>{title}</Text>
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

export function Badge({ label, color = colors.primary }: { label: string; color?: string }) {
  return (
    <View
      style={{
        backgroundColor: color + '22',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: radius.pill,
        alignSelf: 'flex-start',
      }}>
      <Text style={{ color, fontFamily: fonts.semiBold, fontSize: 12 }}>{label}</Text>
    </View>
  );
}

export function SectionTitle({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontFamily: fonts.bold,
        fontSize: 18,
        color: colors.text,
        marginBottom: spacing.sm,
      }}>
      {children}
    </Text>
  );
}
