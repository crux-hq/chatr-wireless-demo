import { View, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type CheckoutProgressProps = {
  currentStep: 1 | 2 | 3 | 4;
  labels: [string, string, string, string];
};

export function CheckoutProgress({ currentStep, labels }: CheckoutProgressProps) {
  return (
    <View style={{ flexDirection: 'row', marginBottom: spacing.xl, gap: spacing.xs }}>
      {labels.map((label, index) => {
        const step = index + 1;
        const completed = step < currentStep;
        const active = step === currentStep;
        return (
          <View key={label} style={{ flex: 1, alignItems: 'center' }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: completed ? colors.green : active ? colors.primary : colors.grayMid,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: spacing.xs,
              }}>
              {completed ? (
                <Check color={colors.white} size={16} />
              ) : (
                <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: active ? colors.white : colors.textMuted }}>
                  {step}
                </Text>
              )}
            </View>
            <Text
              style={{
                fontFamily: active ? fonts.bold : fonts.regular,
                fontSize: 11,
                lineHeight: 14,
                color: active ? colors.primary : colors.textMuted,
                textAlign: 'center',
              }}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
