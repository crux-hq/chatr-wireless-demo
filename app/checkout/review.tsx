import { useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { Card } from '@/components/ui/Button';
import { CheckoutProgress } from './_components/CheckoutProgress';
import { CheckoutOrderSummary } from './_components/CheckoutOrderSummary';
import { CheckoutNav } from './_components/CheckoutNav';
import { CHECKOUT_PAYMENT_OPTIONS, formatCustomerAddress, getCheckoutStepLabels, getInitialCustomerDetails, isSimOnlyCheckout } from '@/lib/checkout';
import { getPlanById } from '@/lib/mock/plans';
import { useAppStore } from '@/lib/store';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: spacing.sm }}>
      <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>{label}</Text>
      <Text style={{ fontFamily: fonts.semiBold, fontSize: 16, color: colors.text, marginTop: 2 }}>{value}</Text>
    </View>
  );
}

export default function CheckoutReviewScreen() {
  const { t } = useTranslation();
  const draft = useAppStore((s) => s.activationDraft);
  const user = useAppStore((s) => s.user);
  const simOnly = isSimOnlyCheckout(draft.checkoutMode);
  const [loading, setLoading] = useState(false);
  const customerDetails = getInitialCustomerDetails(user, draft.customerDetails);

  const plan = simOnly ? null : getPlanById(draft.planId);
  const stepLabels = getCheckoutStepLabels(draft.checkoutMode, t);
  const currentStep = 5;
  const payment = CHECKOUT_PAYMENT_OPTIONS.find((option) => option.id === draft.paymentMethodId) ?? CHECKOUT_PAYMENT_OPTIONS[0];
  const simLabel =
    draft.simType === 'physical-order'
      ? t('checkout.simOptions.physical-order.title')
      : t('checkout.simOptions.esim.title');

  if (!simOnly && !plan) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.gray }}>
        <Header />
        <Text style={{ padding: spacing.md }}>{t('errors.planNotFound')}</Text>
      </View>
    );
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    router.replace('/checkout/success');
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('checkout.reviewTitle')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, paddingBottom: 100 }}>
        <CheckoutProgress currentStep={currentStep} labels={stepLabels} />
        <CheckoutOrderSummary checkoutMode={draft.checkoutMode} plan={plan} simType={draft.simType} />

        <Card style={{ padding: spacing.lg, marginBottom: spacing.lg }}>
          <ReviewRow
            label={t('checkout.reviewCustomer')}
            value={`${customerDetails.firstName} ${customerDetails.lastName}`}
          />
          <ReviewRow label={t('checkout.reviewEmail')} value={customerDetails.email} />
          <ReviewRow label={t('checkout.reviewAddress')} value={formatCustomerAddress(customerDetails)} />
          <ReviewRow label={t('checkout.reviewSim')} value={simLabel} />
          <ReviewRow
            label={t('checkout.reviewPhone')}
            value={
              draft.phoneNumberMode === 'port'
                ? t('checkout.reviewExistingPhone', { number: draft.phoneNumber })
                : draft.phoneNumber
            }
          />
          <ReviewRow
            label={t('checkout.reviewPayment')}
            value={t('checkout.paymentCardLabel', { brand: payment.brand, last4: payment.last4 })}
          />
        </Card>

        <CheckoutNav
          continueLabel={t('checkout.placeOrder')}
          onContinue={() => void handlePlaceOrder()}
          loading={loading}
        />
        <PublicHomeFooter bleedPadding={spacing.lg} />
      </PageScrollView>
    </View>
  );
}
