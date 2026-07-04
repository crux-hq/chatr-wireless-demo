import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { colors, radius, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type InputProps = TextInputProps & {
  label: string;
  required?: boolean;
  error?: string;
};

export function Input({ label, required, error, style, ...props }: InputProps) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={{ fontFamily: fonts.semiBold, marginBottom: spacing.xs, color: colors.text }}>
        {label}
        {required ? <Text style={{ color: colors.red }}> *</Text> : null}
      </Text>
      <TextInput
        {...props}
        style={[
          {
            borderWidth: 1,
            borderColor: error ? colors.red : colors.grayMid,
            borderRadius: radius.sm,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm + 4,
            backgroundColor: colors.surfaceElevated,
            fontSize: 16,
            fontFamily: fonts.regular,
            color: colors.text,
          },
          style,
        ]}
        placeholderTextColor={colors.textMuted}
      />
      {error ? (
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.red, marginTop: spacing.xs }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
