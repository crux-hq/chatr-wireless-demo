import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mockApiCall } from '@/lib/mock/api';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/i18n';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const AMOUNTS = [15, 19, 25, 29, 45];

function digitsOnly(value: string) {
  return value.replace(/\D/g, '');
}

function formatPhoneDisplay(value: string) {
  const digits = digitsOnly(value).slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

type StepProps = {
  step: number;
  title: string;
  active: boolean;
  completed: boolean;
  locked: boolean;
  children?: React.ReactNode;
  showDivider: boolean;
};

function WizardStep({ step, title, active, completed, locked, children, showDivider }: StepProps) {
  const circleBg = locked ? colors.grayMid : colors.primary;

  return (
    <>
      <View style={{ padding: spacing.lg, backgroundColor: colors.white }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: circleBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {completed && !active ? (
              <Check size={18} color={colors.white} strokeWidth={3} />
            ) : (
              <Text style={{ color: locked ? colors.textMuted : colors.white, fontFamily: fonts.extraBold }}>
                {step}
              </Text>
            )}
          </View>
          <Text
            style={{
              fontFamily: fonts.semiBold,
              fontSize: 16,
              color: locked ? colors.textMuted : colors.text,
              flex: 1,
            }}>
            {title}
          </Text>
        </View>
        {active && children ? <View style={{ marginTop: spacing.lg }}>{children}</View> : null}
      </View>
      {showDivider ? <View style={{ height: 1, backgroundColor: colors.grayMid }} /> : null}
    </>
  );
}

export function GuestTopUpWizard() {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const [activeStep, setActiveStep] = useState(1);
  const [completedThrough, setCompletedThrough] = useState(0);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState(29);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmationId, setConfirmationId] = useState('');

  const phoneDigits = digitsOnly(phone);
  const phoneValid = phoneDigits.length === 10;
  const cardValid = digitsOnly(cardNumber).length >= 15 && expiry.length >= 4 && cvv.length >= 3;

  const advance = (from: number) => {
    setCompletedThrough(Math.max(completedThrough, from));
    setActiveStep(from + 1);
  };

  const handleConfirm = async () => {
    setLoading(true);
    await mockApiCall(null);
    setConfirmationId(`TU-${Date.now().toString().slice(-8)}`);
    setConfirmed(true);
    setCompletedThrough(4);
    setActiveStep(4);
    setLoading(false);
  };

  const steps = [
    { key: 'phone', title: t('topUp.guest.stepPhone') },
    { key: 'payment', title: t('topUp.guest.stepPayment') },
    { key: 'review', title: t('topUp.guest.stepReview') },
    { key: 'confirmation', title: t('topUp.guest.stepConfirmation') },
  ] as const;

  return (
    <View>
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.grayMid,
          borderRadius: radius.md,
          overflow: 'hidden',
          marginBottom: spacing.lg,
        }}>
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const locked = stepNum > completedThrough + 1;
          const completed = stepNum <= completedThrough && !(stepNum === 4 && !confirmed);
          const active = activeStep === stepNum;

          return (
            <WizardStep
              key={step.key}
              step={stepNum}
              title={step.title}
              active={active}
              completed={completed}
              locked={locked}
              showDivider={index < steps.length - 1}>
              {stepNum === 1 ? (
                <>
                  <Text style={{ color: colors.textMuted, lineHeight: 22, marginBottom: spacing.md }}>
                    {t('topUp.guest.phoneHint')}
                  </Text>
                  <Input
                    label={t('topUp.guest.phoneLabel')}
                    value={formatPhoneDisplay(phone)}
                    onChangeText={(value) => setPhone(digitsOnly(value).slice(0, 10))}
                    keyboardType="phone-pad"
                    placeholder="(416) 555-0199"
                  />
                  <Button
                    title={t('common.continue')}
                    variant="secondary"
                    disabled={!phoneValid}
                    onPress={() => advance(1)}
                  />
                </>
              ) : null}

              {stepNum === 2 ? (
                <>
                  <Text style={{ fontFamily: fonts.bold, marginBottom: spacing.sm }}>{t('topUp.selectAmount')}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg }}>
                    {AMOUNTS.map((amt) => (
                      <Pressable
                        key={amt}
                        onPress={() => setAmount(amt)}
                        style={{
                          padding: spacing.md,
                          borderRadius: radius.md,
                          backgroundColor: amount === amt ? colors.primary : colors.lavender,
                          minWidth: 72,
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontFamily: fonts.bold,
                            color: amount === amt ? colors.white : colors.text,
                          }}>
                          {formatCurrency(amt, locale)}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <Input
                    label={t('topUp.cardNumber')}
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    keyboardType="numeric"
                    placeholder="4242 4242 4242 4242"
                  />
                  <View style={{ flexDirection: 'row', gap: spacing.md }}>
                    <View style={{ flex: 1 }}>
                      <Input
                        label={t('topUp.expiry')}
                        value={expiry}
                        onChangeText={setExpiry}
                        keyboardType="numeric"
                        placeholder="MM/YY"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Input label={t('topUp.cvv')} value={cvv} onChangeText={setCvv} keyboardType="numeric" placeholder="123" secureTextEntry />
                    </View>
                  </View>
                  <Button
                    title={t('common.continue')}
                    variant="secondary"
                    disabled={!cardValid}
                    onPress={() => advance(2)}
                  />
                </>
              ) : null}

              {stepNum === 3 ? (
                <>
                  <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ color: colors.textMuted }}>{t('topUp.guest.reviewPhone')}</Text>
                      <Text style={{ fontFamily: fonts.semiBold }}>{formatPhoneDisplay(phone)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ color: colors.textMuted }}>{t('topUp.amount')}</Text>
                      <Text style={{ fontFamily: fonts.semiBold }}>{formatCurrency(amount, locale)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ color: colors.textMuted }}>{t('topUp.paymentMethod')}</Text>
                      <Text style={{ fontFamily: fonts.semiBold }}>
                        Visa •••• {digitsOnly(cardNumber).slice(-4) || '4242'}
                      </Text>
                    </View>
                  </View>
                  <Button title={t('topUp.guest.confirmPayment')} onPress={() => void handleConfirm()} loading={loading} variant="secondary" />
                </>
              ) : null}

              {stepNum === 4 && confirmed ? (
                <View style={{ alignItems: 'center', paddingVertical: spacing.md }}>
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: colors.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: spacing.md,
                    }}>
                    <Check size={32} color={colors.white} strokeWidth={3} />
                  </View>
                  <Text style={{ fontFamily: fonts.extraBold, fontSize: 20, marginBottom: spacing.sm, textAlign: 'center' }}>
                    {t('topUp.success')}
                  </Text>
                  <Text style={{ color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: spacing.md }}>
                    {t('topUp.guest.confirmationBody', {
                      amount: formatCurrency(amount, locale),
                      phone: formatPhoneDisplay(phone),
                    })}
                  </Text>
                  <Text style={{ fontFamily: fonts.semiBold, marginBottom: spacing.lg }}>
                    {t('topUp.guest.confirmationId', { id: confirmationId })}
                  </Text>
                  <Button title={t('common.done')} onPress={() => router.replace('/top-up')} />
                </View>
              ) : null}
            </WizardStep>
          );
        })}
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: colors.grayMid,
          borderRadius: radius.md,
          padding: spacing.md,
          backgroundColor: colors.white,
        }}>
        <Text style={{ fontFamily: fonts.semiBold, marginBottom: spacing.xs }}>{t('topUp.guest.merchantTitle')}</Text>
        <Text style={{ color: colors.textMuted, lineHeight: 22 }}>{t('topUp.guest.merchantAddress')}</Text>
      </View>
    </View>
  );
}
