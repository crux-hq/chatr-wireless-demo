import { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { Input } from '@/components/ui/Input';
import { ProvinceSelectField } from '@/components/plans/ProvinceSelectField';
import { CheckoutProgress } from './_components/CheckoutProgress';
import { CheckoutOrderSummary } from './_components/CheckoutOrderSummary';
import { CheckoutNav } from './_components/CheckoutNav';
import {
  getCheckoutStepLabels,
  getCustomerDetailsFieldErrors,
  getInitialCustomerDetails,
  isCustomerDetailsComplete,
  isSimOnlyCheckout,
  type CheckoutCustomerDetails,
} from '@/lib/checkout';
import { getPlanById } from '@/lib/mock/plans';
import { useAppStore } from '@/lib/store';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const FIELD_LABEL_KEYS: Record<keyof CheckoutCustomerDetails, string> = {
  firstName: 'auth.firstName',
  lastName: 'auth.lastName',
  email: 'auth.email',
  address: 'profile.address',
  city: 'profile.city',
  province: 'profile.province',
  postalCode: 'profile.postalCode',
};

export default function CheckoutDetailsScreen() {
  const { t } = useTranslation();
  const user = useAppStore((s) => s.user);
  const draft = useAppStore((s) => s.activationDraft);
  const setActivationDraft = useAppStore((s) => s.setActivationDraft);
  const simOnly = isSimOnlyCheckout(draft.checkoutMode);
  const [details, setDetails] = useState<CheckoutCustomerDetails>(() =>
    getInitialCustomerDetails(user, draft.customerDetails),
  );
  const [showErrors, setShowErrors] = useState(false);

  const plan = simOnly ? null : getPlanById(draft.planId);
  const stepLabels = getCheckoutStepLabels(draft.checkoutMode, t);
  const currentStep = 3;
  const fieldErrors = useMemo(() => getCustomerDetailsFieldErrors(details), [details]);
  const isComplete = isCustomerDetailsComplete(details);

  const getFieldError = (field: keyof CheckoutCustomerDetails) => {
    if (!showErrors) return undefined;
    const code = fieldErrors[field];
    if (!code) return undefined;
    return t(`checkout.validation.${code}`);
  };

  const continueHint = useMemo(() => {
    if (isComplete) return undefined;
    const missingLabels = (Object.keys(fieldErrors) as Array<keyof CheckoutCustomerDetails>).map((field) =>
      t(FIELD_LABEL_KEYS[field]),
    );
    if (missingLabels.length === 0) return t('checkout.validation.completeRequiredFields');
    return t('checkout.validation.missingFields', { fields: missingLabels.join(', ') });
  }, [fieldErrors, isComplete, t]);

  if (!simOnly && !plan) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.gray }}>
        <Header />
        <Text style={{ padding: spacing.md }}>{t('errors.planNotFound')}</Text>
      </View>
    );
  }

  const updateField = <K extends keyof CheckoutCustomerDetails>(key: K, value: CheckoutCustomerDetails[K]) => {
    setDetails((current) => ({ ...current, [key]: value }));
  };

  const handleContinue = () => {
    if (!isComplete) {
      setShowErrors(true);
      return;
    }
    setActivationDraft({ customerDetails: details });
    router.push('/checkout/payment');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('checkout.personalDetailsTitle')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, paddingBottom: 100 }}>
        <CheckoutProgress currentStep={currentStep} labels={stepLabels} />
        <CheckoutOrderSummary checkoutMode={draft.checkoutMode} plan={plan} simType={draft.simType} />

        <Text style={{ fontFamily: fonts.bold, fontSize: 20, marginBottom: spacing.xs }}>
          {t('checkout.personalDetailsTitle')}
        </Text>
        <Text
          style={{
            fontFamily: fonts.regular,
            fontSize: 15,
            color: colors.textMuted,
            marginBottom: spacing.sm,
            lineHeight: 22,
          }}>
          {t('checkout.personalDetailsSubtitle')}
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginBottom: spacing.md }}>
          {t('checkout.requiredFieldsNote')}
        </Text>

        {!isComplete ? (
          <View
            style={{
              backgroundColor: colors.lavenderLight,
              borderRadius: radius.md,
              padding: spacing.md,
              marginBottom: spacing.md,
              borderWidth: 1,
              borderColor: colors.grayMid,
            }}>
            <Text style={{ fontFamily: fonts.semiBold, fontSize: 14, color: colors.text, marginBottom: spacing.xs }}>
              {t('checkout.validation.requiredHeading')}
            </Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, lineHeight: 20 }}>
              {continueHint}
            </Text>
          </View>
        ) : null}

        <Input
          label={t('auth.firstName')}
          required
          value={details.firstName}
          onChangeText={(value) => updateField('firstName', value)}
          error={getFieldError('firstName')}
        />
        <Input
          label={t('auth.lastName')}
          required
          value={details.lastName}
          onChangeText={(value) => updateField('lastName', value)}
          error={getFieldError('lastName')}
        />
        <Input
          label={t('auth.email')}
          required
          value={details.email}
          onChangeText={(value) => updateField('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          error={getFieldError('email')}
        />
        <Input
          label={t('profile.address')}
          required
          value={details.address}
          onChangeText={(value) => updateField('address', value)}
          error={getFieldError('address')}
        />
        <Input
          label={t('profile.city')}
          required
          value={details.city}
          onChangeText={(value) => updateField('city', value)}
          error={getFieldError('city')}
        />
        <ProvinceSelectField
          label={t('profile.province')}
          required
          value={details.province}
          onChange={(code) => updateField('province', code)}
          error={getFieldError('province')}
        />
        <Input
          label={t('profile.postalCode')}
          required
          value={details.postalCode}
          onChangeText={(value) => updateField('postalCode', value)}
          autoCapitalize="characters"
          error={getFieldError('postalCode')}
        />

        <CheckoutNav
          continueLabel={t('common.continue')}
          onContinue={handleContinue}
          continueHint={!isComplete ? continueHint : undefined}
        />
        <PublicHomeFooter bleedPadding={spacing.lg} />
      </PageScrollView>
    </View>
  );
}
