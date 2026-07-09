import { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { Button, Card, Badge } from '@/components/ui/Button';
import { AddOnSetupDialog } from '@/components/addons/AddOnSetupDialog';
import { AutoPayConfirmDialog } from '@/components/top-up/AutoPayConfirmDialog';
import { navigateToAuthScreen } from '@/lib/nav-auth';
import { useAppStore } from '@/lib/store';
import { getPlanById } from '@/lib/mock/plans';
import { formatDate } from '@/lib/i18n';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function AutoPayScreen() {
  const { t } = useTranslation();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const user = useAppStore((s) => s.user);
  const locale = useAppStore((s) => s.locale);
  const toggleAutoPay = useAppStore((s) => s.toggleAutoPay);
  const [setupVisible, setSetupVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMode, setConfirmMode] = useState<'enroll' | 'disable'>('enroll');
  const [confirming, setConfirming] = useState(false);

  const plan = user ? getPlanById(user.planId) : null;
  const autoPayEnabled = user?.autoPayEnabled ?? false;
  const autoPayCard =
    user?.paymentMethods.find((card) => card.isAutoPay) ?? user?.paymentMethods[0] ?? null;
  const paymentLabel = autoPayCard ? `${autoPayCard.brand} •••• ${autoPayCard.last4}` : null;
  const renewalDate = useMemo(
    () => formatDate(user?.anniversaryDate ?? '', locale),
    [user?.anniversaryDate, locale],
  );

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setSetupVisible(true);
      return;
    }
    action();
  };

  const openConfirm = (mode: 'enroll' | 'disable') => {
    requireAuth(() => {
      setConfirmMode(mode);
      setConfirmVisible(true);
    });
  };

  const handleConfirm = () => {
    setConfirming(true);
    toggleAutoPay(confirmMode === 'enroll');
    setConfirming(false);
    setConfirmVisible(false);
    router.replace('/(tabs)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <AddOnSetupDialog
        visible={setupVisible}
        onClose={() => setSetupVisible(false)}
        onActivate={() => {
          setSetupVisible(false);
          router.push('/activate');
        }}
        onSignIn={() => {
          setSetupVisible(false);
          navigateToAuthScreen('/sign-in');
        }}
      />
      <AutoPayConfirmDialog
        visible={confirmVisible}
        mode={confirmMode}
        paymentLabel={paymentLabel}
        renewalDate={renewalDate || t('topUp.autoPayRenewalLabel')}
        bonusGb={plan?.autoPayBonusGb ?? 0}
        loading={confirming}
        onClose={() => setConfirmVisible(false)}
        onConfirm={handleConfirm}
      />
      <Header />
      <PageTitle>{t('topUp.autoPay')}</PageTitle>
      <PageScrollView
        contentContainerStyle={{ padding: spacing.md, paddingBottom: isAuthenticated ? spacing.md : 100 }}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.text, flex: 1 }}>
              {t('topUp.autoPayOverviewTitle')}
            </Text>
            <Badge
              label={autoPayEnabled ? t('topUp.autoPayStatusOn') : t('topUp.autoPayStatusOff')}
              color={autoPayEnabled ? colors.primary : colors.textMuted}
            />
          </View>
          <Text
            style={{
              marginTop: spacing.sm,
              fontFamily: fonts.regular,
              fontSize: 15,
              lineHeight: 23,
              color: colors.textMuted,
            }}>
            {t('topUp.autoPayOverviewBody')}
          </Text>
          {plan && plan.autoPayBonusGb > 0 ? (
            <Text style={{ marginTop: spacing.md, color: colors.primary, fontFamily: fonts.semiBold }}>
              {t('topUp.autoPayBonusLine', { gb: plan.autoPayBonusGb })}
            </Text>
          ) : null}
          {renewalDate ? (
            <Text style={{ marginTop: spacing.sm, fontFamily: fonts.medium, color: colors.text }}>
              {t('topUp.autoPayRenewalLabel')}: {renewalDate}
            </Text>
          ) : null}
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.text }}>
            {t('topUp.autoPayPaymentTitle')}
          </Text>
          {autoPayCard ? (
            <>
              <Text style={{ marginTop: spacing.sm, fontFamily: fonts.bold, color: colors.text }}>
                {paymentLabel}
              </Text>
              <Text style={{ color: colors.grayDark, marginTop: 2 }}>
                Exp {autoPayCard.expiryMonth}/{autoPayCard.expiryYear}
              </Text>
            </>
          ) : (
            <Text style={{ marginTop: spacing.sm, fontFamily: fonts.regular, color: colors.textMuted }}>
              {t('topUp.autoPayNoPayment')}
            </Text>
          )}
          <Text
            style={{
              marginTop: spacing.md,
              fontFamily: fonts.regular,
              fontSize: 14,
              lineHeight: 21,
              color: colors.textMuted,
            }}>
            {t('topUp.autoPayManageHint')}
          </Text>
        </Card>

        <View style={{ marginTop: spacing.lg }}>
          <Button
            title={autoPayEnabled ? t('topUp.disableAutoPay') : t('topUp.autoPayContinue')}
            onPress={() => openConfirm(autoPayEnabled ? 'disable' : 'enroll')}
            variant={autoPayEnabled ? 'outline' : 'primary'}
            disabled={!autoPayEnabled && !autoPayCard && isAuthenticated}
          />
        </View>
        {!isAuthenticated ? <PublicHomeFooter /> : null}
      </PageScrollView>
    </View>
  );
}
