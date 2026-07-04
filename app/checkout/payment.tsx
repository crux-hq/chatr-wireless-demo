import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CreditCard } from 'lucide-react-native';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { CheckoutProgress } from './_components/CheckoutProgress';
import { CheckoutOrderSummary } from './_components/CheckoutOrderSummary';
import { CheckoutNav } from './_components/CheckoutNav';
import { SimOptionCard } from './_components/SimOptionCard';
import {
  CHECKOUT_PAYMENT_OPTIONS,
  getCheckoutStepLabels,
  isCustomerDetailsComplete,
  isSimOnlyCheckout,
} from '@/lib/checkout';
import { getPlanById } from '@/lib/mock/plans';
import { useAppStore } from '@/lib/store';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function CheckoutPaymentScreen() {
  const { t } = useTranslation();
  const draft = useAppStore((s) => s.activationDraft);
  const setActivationDraft = useAppStore((s) => s.setActivationDraft);
  const simOnly = isSimOnlyCheckout(draft.checkoutMode);
  const [selected, setSelected] = useState(draft.paymentMethodId ?? CHECKOUT_PAYMENT_OPTIONS[0].id);

  const plan = simOnly ? null : getPlanById(draft.planId);
  const stepLabels = getCheckoutStepLabels(draft.checkoutMode, t);
  const currentStep = 4;

  useEffect(() => {
    if (!isCustomerDetailsComplete(draft.customerDetails)) {
      router.replace('/checkout/details');
    }
  }, [draft.customerDetails]);

  useEffect(() => {
    if (simOnly) return;
    if (!plan) router.replace('/checkout/sim');
  }, [simOnly, plan]);

  if (!simOnly && !plan) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.gray }}>
        <Header />
        <Text style={{ padding: spacing.md }}>{t('errors.planNotFound')}</Text>
      </View>
    );
  }

  const handleContinue = () => {
    setActivationDraft({ paymentMethodId: selected });
    router.push('/checkout/review');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('checkout.paymentTitle')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, paddingBottom: 100 }}>
        <CheckoutProgress currentStep={currentStep} labels={stepLabels} />
        <CheckoutOrderSummary checkoutMode={draft.checkoutMode} plan={plan} simType={draft.simType} />

        <Text style={{ fontFamily: fonts.bold, fontSize: 20, marginBottom: spacing.md }}>{t('checkout.selectPayment')}</Text>

        {CHECKOUT_PAYMENT_OPTIONS.map((option) => (
          <SimOptionCard
            key={option.id}
            title={t('checkout.paymentCardLabel', { brand: option.brand, last4: option.last4 })}
            description={t('checkout.paymentCardExpiry', { expiry: option.expiry })}
            selected={selected === option.id}
            onPress={() => setSelected(option.id)}
            icon={<CreditCard color={colors.primary} size={24} />}
          />
        ))}

        <CheckoutNav continueLabel={t('common.continue')} onContinue={handleContinue} />
        <PublicHomeFooter bleedPadding={spacing.lg} />
      </PageScrollView>
    </View>
  );
}
