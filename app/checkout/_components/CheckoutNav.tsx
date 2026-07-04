import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { navigateToAuthScreen } from '@/lib/nav-auth';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type CheckoutNavProps = {
  continueLabel: string;
  onContinue: () => void;
  continueDisabled?: boolean;
  continueHint?: string;
  loading?: boolean;
};

export function CheckoutNav({ continueLabel, onContinue, continueDisabled, continueHint, loading }: CheckoutNavProps) {
  const { t } = useTranslation();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
        <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <ChevronLeft size={20} color={colors.primary} />
          <Text style={{ color: colors.primary, fontFamily: fonts.semiBold }}>{t('common.back')}</Text>
        </Pressable>
      </View>
      {continueHint ? (
        <Text
          style={{
            fontFamily: fonts.regular,
            fontSize: 14,
            color: colors.red,
            marginBottom: spacing.sm,
            lineHeight: 20,
          }}>
          {continueHint}
        </Text>
      ) : null}
      <Button title={continueLabel} onPress={onContinue} disabled={continueDisabled} loading={loading} />
      {!isAuthenticated ? (
        <Pressable
          onPress={() => navigateToAuthScreen('/sign-in')}
          style={({ pressed }) => ({
            marginTop: spacing.lg,
            paddingVertical: spacing.sm,
            alignSelf: 'center',
            opacity: pressed ? 0.75 : 1,
          })}>
          <Text
            style={{
              fontFamily: fonts.semiBold,
              fontSize: 16,
              color: colors.primary,
              textDecorationLine: 'underline',
              textAlign: 'center',
            }}>
            {t('checkout.signInForFasterCheckout', { defaultValue: 'Sign in for faster checkout' })}
          </Text>
        </Pressable>
      ) : null}
    </>
  );
}
