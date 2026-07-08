import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CreditCard, Ticket } from 'lucide-react-native';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { Input } from '@/components/ui/Input';
import { CheckoutProgress } from './_components/CheckoutProgress';
import { CheckoutOrderSummary } from './_components/CheckoutOrderSummary';
import { CheckoutNav } from './_components/CheckoutNav';
import { SimOptionCard } from './_components/SimOptionCard';
import {
  buildCheckoutVoucherPaymentId,
  CHECKOUT_PAYMENT_OPTIONS,
  CHECKOUT_VOUCHER_PAYMENT_ID,
  getCheckoutStepLabels,
  getCheckoutVoucherCode,
  isCheckoutVoucherPayment,
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
  const initialVoucher = isCheckoutVoucherPayment(draft.paymentMethodId);
  const [selected, setSelected] = useState(
    initialVoucher ? CHECKOUT_VOUCHER_PAYMENT_ID : (draft.paymentMethodId ?? CHECKOUT_PAYMENT_OPTIONS[0].id),
  );
  const [voucherCode, setVoucherCode] = useState(getCheckoutVoucherCode(draft.paymentMethodId));
  const [voucherError, setVoucherError] = useState('');

  const plan = simOnly ? null : getPlanById(draft.planId);
  const stepLabels = getCheckoutStepLabels(draft.checkoutMode, t);
  const currentStep = 4;
  const voucherSelected = selected === CHECKOUT_VOUCHER_PAYMENT_ID;

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
    if (voucherSelected) {
      const trimmed = voucherCode.trim();
      if (!trimmed) {
        setVoucherError(t('checkout.paymentVoucherCodeRequired'));
        return;
      }
      setActivationDraft({ paymentMethodId: buildCheckoutVoucherPaymentId(trimmed) });
      router.push('/checkout/review');
      return;
    }

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
            onPress={() => {
              setSelected(option.id);
              setVoucherError('');
            }}
            icon={<CreditCard color={colors.primary} size={24} />}
          />
        ))}

        <SimOptionCard
          title={t('checkout.paymentVoucherTitle')}
          description={t('checkout.paymentVoucherDesc')}
          selected={voucherSelected}
          onPress={() => setSelected(CHECKOUT_VOUCHER_PAYMENT_ID)}
          icon={<Ticket color={colors.primary} size={24} />}
          extra={
            voucherSelected ? (
              <Input
                label={t('checkout.paymentVoucherCodeLabel')}
                required
                value={voucherCode}
                onChangeText={(value) => {
                  setVoucherCode(value);
                  if (voucherError) setVoucherError('');
                }}
                placeholder={t('checkout.paymentVoucherCodePlaceholder')}
                autoCapitalize="characters"
                autoCorrect={false}
                error={voucherError}
              />
            ) : null
          }
        />

        <CheckoutNav continueLabel={t('common.continue')} onContinue={handleContinue} />
        <PublicHomeFooter bleedPadding={spacing.lg} />
      </PageScrollView>
    </View>
  );
}
