import { useMemo } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { ConfettiBurst } from '@/components/ui/ConfettiBurst';
import { isSimOnlyCheckout } from '@/lib/checkout';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type SuccessAction = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
};

export default function CheckoutSuccessScreen() {
  const { t } = useTranslation();
  const draft = useAppStore((s) => s.activationDraft);
  const simOnly = isSimOnlyCheckout(draft.checkoutMode);
  const isPhysical = draft.simType === 'physical-order';

  const { description, actions } = useMemo(() => {
    if (simOnly && isPhysical) {
      return {
        description: t('checkout.orderCompleteSimPhysical'),
        actions: [
          { label: t('buySim.activateWhenReady'), onPress: () => router.replace('/activate'), variant: 'primary' },
          { label: t('buySim.browsePlans'), onPress: () => router.replace('/plans'), variant: 'outline' },
          { label: t('common.done'), onPress: () => router.replace('/(tabs)'), variant: 'outline' },
        ] satisfies SuccessAction[],
      };
    }

    if (simOnly) {
      return {
        description: t('checkout.orderCompleteSimEsim'),
        actions: [
          { label: t('buySim.browsePlans'), onPress: () => router.replace('/plans'), variant: 'primary' },
          { label: t('common.done'), onPress: () => router.replace('/(tabs)'), variant: 'outline' },
        ] satisfies SuccessAction[],
      };
    }

    if (isPhysical) {
      return {
        description: t('checkout.orderCompletePlanPhysical'),
        actions: [
          { label: t('buySim.activateWhenReady'), onPress: () => router.replace('/activate'), variant: 'primary' },
          { label: t('buySim.browsePlans'), onPress: () => router.replace('/plans'), variant: 'outline' },
          { label: t('common.done'), onPress: () => router.replace('/(tabs)'), variant: 'outline' },
        ] satisfies SuccessAction[],
      };
    }

    return {
      description: t('checkout.orderCompletePlanEsim'),
      actions: [
        { label: t('checkout.continueActivation'), onPress: () => router.replace('/activate/account'), variant: 'primary' },
        { label: t('common.done'), onPress: () => router.replace('/(tabs)'), variant: 'outline' },
      ] satisfies SuccessAction[],
    };
  }, [isPhysical, simOnly, t]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <ConfettiBurst active />
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl }}>
        <Text style={{ fontSize: 64, color: colors.white }}>✓</Text>
        <Text
          style={{
            fontSize: 28,
            fontFamily: fonts.extraBold,
            color: colors.white,
            marginTop: spacing.md,
            textAlign: 'center',
          }}>
          {t('checkout.orderComplete')}
        </Text>
        <Text
          style={{
            color: colors.white,
            opacity: 0.92,
            marginTop: spacing.sm,
            textAlign: 'center',
            fontFamily: fonts.regular,
            fontSize: 16,
            lineHeight: 24,
            maxWidth: 360,
          }}>
          {description}
        </Text>
        <View style={{ marginTop: spacing.xl, width: '100%', maxWidth: 360, gap: spacing.sm }}>
          {actions.map((action) => (
            <Button
              key={action.label}
              title={action.label}
              onPress={action.onPress}
              variant={action.variant ?? 'primary'}
            />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}
