import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Smartphone, Package } from 'lucide-react-native';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { Toast } from '@/components/ui/Toast';
import { CheckoutProgress } from './_components/CheckoutProgress';
import { CheckoutOrderSummary } from './_components/CheckoutOrderSummary';
import { CheckoutNav } from './_components/CheckoutNav';
import { SimOptionCard } from './_components/SimOptionCard';
import { getCheckoutStepLabels, isSimOnlyCheckout } from '@/lib/checkout';
import type { SimType } from '@/lib/mock/types';
import { getPlanById } from '@/lib/mock/plans';
import { useAppStore } from '@/lib/store';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const ALL_SIM_OPTIONS: { id: SimType; icon: typeof Smartphone }[] = [
  { id: 'esim', icon: Smartphone },
  { id: 'physical-order', icon: Package },
];

export default function CheckoutSimScreen() {
  const { t } = useTranslation();
  const draft = useAppStore((s) => s.activationDraft);
  const setActivationDraft = useAppStore((s) => s.setActivationDraft);
  const simOnly = isSimOnlyCheckout(draft.checkoutMode);
  const [selected, setSelected] = useState<SimType>(
    draft.simType === 'physical-order' || draft.simType === 'esim' ? draft.simType : 'esim',
  );
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!simOnly) return;
    if (draft.physicalSimOnly) {
      router.replace('/checkout/phone-number');
      return;
    }
    router.replace('/buy-sim');
  }, [simOnly, draft.physicalSimOnly]);

  const plan = simOnly ? null : getPlanById(draft.planId);
  const stepLabels = getCheckoutStepLabels(draft.checkoutMode, t);
  const currentStep = 2;

  if (simOnly) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.gray }}>
        <Header />
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.gray }}>
        <Header />
        <Text style={{ padding: spacing.md }}>{t('errors.planNotFound')}</Text>
      </View>
    );
  }

  const handleContinue = () => {
    setActivationDraft({ simType: selected, planId: plan.id, autoPay: true });
    router.push(`/checkout/phone-number?planId=${plan.id}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('checkout.simTitle')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, paddingBottom: 100 }}>
        <CheckoutProgress currentStep={currentStep} labels={stepLabels} />
        <CheckoutOrderSummary checkoutMode={draft.checkoutMode} plan={plan} simType={selected} />

        <Text style={{ fontFamily: fonts.bold, fontSize: 20, marginBottom: spacing.md }}>{t('checkout.selectSim')}</Text>

        {ALL_SIM_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <SimOptionCard
              key={option.id}
              title={t(`checkout.simOptions.${option.id}.title`)}
              description={t(`checkout.simOptions.${option.id}.description`)}
              badge={option.id === 'esim' ? t('checkout.mostPopular') : undefined}
              selected={selected === option.id}
              onPress={() => setSelected(option.id)}
              icon={<Icon color={colors.primary} size={24} />}
              extra={
                option.id === 'esim' ? (
                  <>
                    <Text
                      style={{
                        fontFamily: fonts.regular,
                        fontSize: 14,
                        color: colors.textMuted,
                        lineHeight: 20,
                        marginBottom: spacing.sm,
                      }}>
                      {t('checkout.compatibilityBody')}
                    </Text>
                    <Pressable
                      onPress={() => setToastVisible(true)}
                      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, alignSelf: 'flex-start' })}>
                      <Text
                        style={{
                          fontFamily: fonts.semiBold,
                          fontSize: 14,
                          color: colors.accent,
                          textDecorationLine: 'underline',
                        }}>
                        {t('checkout.checkCompatibility')}
                      </Text>
                    </Pressable>
                  </>
                ) : undefined
              }
            />
          );
        })}

        <CheckoutNav continueLabel={t('common.continue')} onContinue={handleContinue} />
        <PublicHomeFooter bleedPadding={spacing.lg} />
      </PageScrollView>
      <Toast
        message={t('checkout.phoneCompatible')}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}
