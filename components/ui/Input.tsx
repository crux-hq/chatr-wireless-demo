import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { colors, radius, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type InputProps = TextInputProps & {
  label: string;
};

export function Input({ label, ...props }: InputProps) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={{ fontFamily: fonts.semiBold, marginBottom: spacing.xs, color: colors.text }}>{label}</Text>
      <TextInput
        {...props}
        style={{
          borderWidth: 1,
          borderColor: colors.grayMid,
          borderRadius: radius.sm,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm + 4,
          backgroundColor: colors.surfaceElevated,
          fontSize: 16,
          fontFamily: fonts.regular,
          color: colors.text,
        }}
        placeholderTextColor={colors.textMuted}
      />
    </View>
  );
}
