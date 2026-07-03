import { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header, PageTitle } from '@/components/layout/Header';
import { PageSubtitle } from '@/components/layout/PageSubtitle';
import { Button, Card } from '@/components/ui/Button';
import { AddOnSetupDialog } from '@/components/addons/AddOnSetupDialog';
import { navigateToAuthScreen } from '@/lib/nav-auth';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/i18n';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const AMOUNTS = [15, 19, 25, 29, 45];

export default function TopUpPayScreen() {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const user = useAppStore((s) => s.user);
  const topUp = useAppStore((s) => s.topUp);
  const [selected, setSelected] = useState(29);
  const [loading, setLoading] = useState(false);
  const [setupVisible, setSetupVisible] = useState(false);

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setSetupVisible(true);
      return;
    }
    action();
  };

  const handleTopUp = async () => {
    setLoading(true);
    await topUp(selected);
    setLoading(false);
    router.push('/top-up/success');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
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
      <PageTitle>{t('topUp.title')}</PageTitle>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: isAuthenticated ? spacing.md : 100 }}>
        <Pressable onPress={() => router.push('/top-up/auto-pay')}>
          <Card style={{ marginBottom: spacing.md, backgroundColor: colors.lavenderMid }}>
            <Text style={{ fontFamily: fonts.bold }}>{t('topUp.autoPay')}</Text>
            <Text style={{ color: colors.textMuted, marginTop: 4, fontFamily: fonts.regular }}>{t('topUp.autoPayDesc')}</Text>
            <Text style={{ color: colors.primary, fontFamily: fonts.bold, marginTop: 8 }}>
              {isAuthenticated && user?.autoPayEnabled ? t('topUp.autoPayActive') : t('topUp.enrollAutoPay')} →
            </Text>
          </Card>
        </Pressable>

        <Text style={{ fontFamily: fonts.bold, marginBottom: spacing.sm }}>{t('topUp.oneTime')}</Text>
        <PageSubtitle style={{ marginBottom: spacing.md }}>{t('topUp.selectAmount')}</PageSubtitle>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg }}>
          {AMOUNTS.map((amt) => (
            <Pressable
              key={amt}
              onPress={() => setSelected(amt)}
              style={{
                padding: spacing.md,
                borderRadius: 12,
                backgroundColor: selected === amt ? colors.primary : colors.surfaceElevated,
                minWidth: 80,
                alignItems: 'center',
              }}>
              <Text style={{ fontFamily: fonts.bold, color: selected === amt ? colors.white : colors.black }}>
                {formatCurrency(amt, locale)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => requireAuth(() => router.push('/top-up/cards'))}>
          <Card style={{ marginBottom: spacing.lg }}>
            <Text style={{ fontFamily: fonts.bold }}>{t('topUp.paymentMethod')}</Text>
            {isAuthenticated && user?.paymentMethods[0] ? (
              <Text style={{ marginTop: 4 }}>
                {user.paymentMethods[0].brand} •••• {user.paymentMethods[0].last4}
              </Text>
            ) : (
              <Text style={{ color: colors.primary, marginTop: 4 }}>{t('topUp.addCard')} →</Text>
            )}
          </Card>
        </Pressable>

        <Button title={t('common.confirm')} onPress={() => requireAuth(() => void handleTopUp())} loading={loading} />
        {!isAuthenticated ? <PublicHomeFooter /> : null}
      </ScrollView>
    </View>
  );
}
