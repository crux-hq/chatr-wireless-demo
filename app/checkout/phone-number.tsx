import { useState } from 'react';
import { View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Phone, ArrowRightLeft } from 'lucide-react-native';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { Input } from '@/components/ui/Input';
import { CheckoutProgress } from './_components/CheckoutProgress';
import { CheckoutOrderSummary } from './_components/CheckoutOrderSummary';
import { CheckoutNav } from './_components/CheckoutNav';
import { SimOptionCard } from './_components/SimOptionCard';
import { CHECKOUT_PHONE_OPTIONS, getCheckoutStepLabels, isSimOnlyCheckout } from '@/lib/checkout';
import { getPlanById } from '@/lib/mock/plans';
import { useAppStore } from '@/lib/store';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function CheckoutPhoneNumberScreen() {
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { t } = useTranslation();
  const draft = useAppStore((s) => s.activationDraft);
  const setActivationDraft = useAppStore((s) => s.setActivationDraft);
  const simOnly = isSimOnlyCheckout(draft.checkoutMode);
  const [selection, setSelection] = useState<'existing' | string>(
    draft.phoneNumberMode === 'port' ? 'existing' : draft.phoneNumber || CHECKOUT_PHONE_OPTIONS[0].id,
  );
  const [existingNumber, setExistingNumber] = useState(
    draft.phoneNumberMode === 'port' ? draft.phoneNumber : '',
  );

  const plan = simOnly ? null : getPlanById(planId ?? draft.planId);
  const stepLabels = getCheckoutStepLabels(draft.checkoutMode, t);
  const currentStep = simOnly ? 2 : 2;

  if (!simOnly && !plan) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.gray }}>
        <Header />
        <Text style={{ padding: spacing.md }}>{t('errors.planNotFound')}</Text>
      </View>
    );
  }

  const usingExisting = selection === 'existing';
  const canContinue = usingExisting ? existingNumber.replace(/\D/g, '').length >= 10 : Boolean(selection);

  const handleContinue = () => {
    if (usingExisting) {
      setActivationDraft({ phoneNumberMode: 'port', phoneNumber: existingNumber.trim() });
    } else {
      setActivationDraft({ phoneNumberMode: 'new', phoneNumber: selection });
    }
    router.push('/checkout/details');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('checkout.selectPhoneNumber')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, paddingBottom: 100 }}>
        <CheckoutProgress currentStep={currentStep} labels={stepLabels} />
        <CheckoutOrderSummary checkoutMode={draft.checkoutMode} plan={plan} simType={draft.simType} />

        <Text style={{ fontFamily: fonts.bold, fontSize: 20, marginBottom: spacing.xs }}>{t('checkout.selectPhoneNumber')}</Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted, marginBottom: spacing.md, lineHeight: 22 }}>
          {t('checkout.selectPhoneSubtitle')}
        </Text>

        {CHECKOUT_PHONE_OPTIONS.map((option) => (
          <SimOptionCard
            key={option.id}
            title={option.id}
            description={t(option.areaKey)}
            selected={selection === option.id}
            onPress={() => setSelection(option.id)}
            icon={<Phone color={colors.primary} size={24} />}
          />
        ))}

        <SimOptionCard
          title={t('checkout.useExistingNumber')}
          description={t('checkout.useExistingNumberDesc')}
          selected={usingExisting}
          onPress={() => setSelection('existing')}
          icon={<ArrowRightLeft color={colors.primary} size={24} />}
          extra={
            usingExisting ? (
              <Input
                label={t('checkout.existingNumberLabel')}
                value={existingNumber}
                onChangeText={setExistingNumber}
                placeholder={t('checkout.existingNumberPlaceholder')}
                keyboardType="phone-pad"
              />
            ) : undefined
          }
        />

        <CheckoutNav continueLabel={t('common.continue')} onContinue={handleContinue} continueDisabled={!canContinue} />
        <PublicHomeFooter bleedPadding={spacing.lg} />
      </PageScrollView>
    </View>
  );
}
