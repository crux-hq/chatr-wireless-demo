import { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Smartphone, ShoppingBag } from 'lucide-react-native';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { CheckoutProgress } from './_components/CheckoutProgress';
import { CheckoutOrderSummary } from './_components/CheckoutOrderSummary';
import { SimOptionCard } from './_components/SimOptionCard';
import type { SimType } from '@/lib/mock/types';
import { getPlanById } from '@/lib/mock/plans';
import { SIM_PRODUCT } from '@/lib/mock/sim-product';
import { useAppStore } from '@/lib/store';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const SIM_OPTIONS: { id: SimType; icon: typeof Smartphone }[] = [
  { id: 'esim', icon: Smartphone },
  { id: 'physical-order', icon: ShoppingBag },
];

export default function CheckoutSimScreen() {
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { t } = useTranslation();
  const draft = useAppStore((s) => s.activationDraft);
  const setActivationDraft = useAppStore((s) => s.setActivationDraft);
  const addToCart = useAppStore((s) => s.addToCart);
  const [selected, setSelected] = useState<SimType>(draft.simType === 'physical-order' ? 'physical-order' : 'esim');
  const [toastVisible, setToastVisible] = useState(false);

  const plan = getPlanById(planId ?? draft.planId);

  if (!plan) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.gray }}>
        <Header />
        <Text style={{ padding: spacing.md }}>{t('errors.planNotFound')}</Text>
      </View>
    );
  }

  const stepLabels = [
    t('checkout.steps.selectPlan'),
    t('checkout.steps.phoneSim'),
    t('checkout.steps.payment'),
    t('checkout.steps.review'),
  ] as [string, string, string, string];

  const handleContinue = () => {
    setActivationDraft({ simType: selected, planId: plan.id, autoPay: true });
    if (selected === 'esim') {
      router.push('/activate/account');
      return;
    }
    addToCart(SIM_PRODUCT.id);
    router.push('/buy-sim');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('checkout.simTitle')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, paddingBottom: 100 }}>
        <CheckoutProgress currentStep={2} labels={stepLabels} />
        <CheckoutOrderSummary plan={plan} />

        <Text style={{ fontFamily: fonts.bold, fontSize: 20, marginBottom: spacing.md }}>{t('checkout.selectSim')}</Text>

        {SIM_OPTIONS.map((option) => {
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

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
          <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <ChevronLeft size={20} color={colors.primary} />
            <Text style={{ color: colors.primary, fontFamily: fonts.semiBold }}>{t('common.back')}</Text>
          </Pressable>
        </View>

        <Button title={t('common.continue')} onPress={handleContinue} />
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
