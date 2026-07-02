import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { colors, radius, spacing } from '@/lib/theme/colors';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
};

export function Button({ title, onPress, variant = 'primary', loading, disabled }: ButtonProps) {
  const bg =
    variant === 'primary'
      ? colors.green
      : variant === 'secondary'
        ? colors.yellow
        : 'transparent';
  const textColor =
    variant === 'secondary' ? colors.black : variant === 'outline' || variant === 'ghost' ? colors.green : colors.white;
  const borderWidth = variant === 'outline' ? 2 : 0;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={{
        backgroundColor: bg,
        borderWidth,
        borderColor: colors.green,
        borderRadius: radius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        opacity: disabled || loading ? 0.6 : 1,
      }}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={{ color: textColor, fontWeight: '700', fontSize: 16 }}>{title}</Text>
      )}
    </Pressable>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderRadius: radius.lg,
        padding: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        ...style,
      }}>
      {children}
    </View>
  );
}

export function Badge({ label, color = colors.green }: { label: string; color?: string }) {
  return (
    <View
      style={{
        backgroundColor: color + '22',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radius.full,
        alignSelf: 'flex-start',
      }}>
      <Text style={{ color, fontWeight: '600', fontSize: 12 }}>{label}</Text>
    </View>
  );
}

export function SectionTitle({ children }: { children: string }) {
  return (
    <Text style={{ fontSize: 18, fontWeight: '700', color: colors.black, marginBottom: spacing.sm }}>
      {children}
    </Text>
  );
}
