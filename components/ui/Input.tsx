import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { colors, radius, spacing } from '@/lib/theme/colors';

type InputProps = TextInputProps & {
  label: string;
};

export function Input({ label, ...props }: InputProps) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={{ fontWeight: '600', marginBottom: spacing.xs, color: colors.black }}>{label}</Text>
      <TextInput
        {...props}
        style={{
          borderWidth: 1,
          borderColor: colors.grayMid,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm + 4,
          backgroundColor: colors.white,
          fontSize: 16,
          color: colors.black,
        }}
        placeholderTextColor={colors.grayDark}
      />
    </View>
  );
}
