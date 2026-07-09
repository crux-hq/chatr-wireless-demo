import { useState } from 'react';
import { View, Text } from 'react-native';
import { router, Redirect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { Button, Card, Badge } from '@/components/ui/Button';
import { AddOnSetupDialog } from '@/components/addons/AddOnSetupDialog';
import { navigateToAuthScreen } from '@/lib/nav-auth';
import { useAppStore } from '@/lib/store';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function AutoPayScreen() {
  const { t } = useTranslation();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const [setupVisible, setSetupVisible] = useState(false);

  if (isAuthenticated) {
    return <Redirect href={'/(tabs)/top-up/auto-pay'} />;
  }

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
      <Header />
      <PageTitle>{t('topUp.autoPay')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.text, flex: 1 }}>
              {t('topUp.autoPayOverviewTitle')}
            </Text>
            <Badge label={t('topUp.autoPayStatusOff')} color={colors.textMuted} />
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
          <Text style={{ marginTop: spacing.md, color: colors.primary, fontFamily: fonts.semiBold }}>
            {t('topUp.autoPayBonusLine', { gb: 5 })}
          </Text>
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.text }}>
            {t('topUp.autoPayPaymentTitle')}
          </Text>
          <Text style={{ marginTop: spacing.sm, fontFamily: fonts.regular, color: colors.textMuted }}>
            {t('topUp.autoPayNoPayment')}
          </Text>
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
          <Button title={t('topUp.autoPayContinue')} onPress={() => setSetupVisible(true)} />
        </View>
        <PublicHomeFooter />
      </PageScrollView>
    </View>
  );
}
