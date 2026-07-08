import { useState } from 'react';
import { ScrollView, View, Text, Switch } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { Button, Card } from '@/components/ui/Button';
import { AddOnSetupDialog } from '@/components/addons/AddOnSetupDialog';
import { navigateToAuthScreen } from '@/lib/nav-auth';
import { useAppStore } from '@/lib/store';
import { getPlanById } from '@/lib/mock/plans';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function AutoPayScreen() {
  const { t } = useTranslation();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const user = useAppStore((s) => s.user);
  const toggleAutoPay = useAppStore((s) => s.toggleAutoPay);
  const [setupVisible, setSetupVisible] = useState(false);

  const plan = user ? getPlanById(user.planId) : null;

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setSetupVisible(true);
      return;
    }
    action();
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
      <Header />
      <PageTitle>{t('topUp.autoPay')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: isAuthenticated ? spacing.md : 100 }}>
        <Card>
          <Text style={{ fontFamily: fonts.bold, fontSize: 18 }}>{t('topUp.autoPayDesc')}</Text>
          {plan && plan.autoPayBonusGb > 0 ? (
            <Text style={{ marginTop: spacing.sm, color: colors.green, fontFamily: fonts.semiBold }}>
              +{plan.autoPayBonusGb} GB bonus data every cycle
            </Text>
          ) : null}

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg }}>
            <Text style={{ fontFamily: fonts.semiBold }}>{t('topUp.enrollAutoPay')}</Text>
            <Switch
              value={user?.autoPayEnabled ?? false}
              onValueChange={(enabled) => requireAuth(() => toggleAutoPay(enabled))}
              trackColor={{ true: colors.green }}
            />
          </View>
        </Card>

        {user?.paymentMethods.map((card) => (
          <Card key={card.id} style={{ marginTop: spacing.md }}>
            <Text style={{ fontFamily: fonts.bold }}>
              {card.brand} •••• {card.last4}
            </Text>
            <Text style={{ color: colors.grayDark }}>
              Exp {card.expiryMonth}/{card.expiryYear}
            </Text>
            {card.isAutoPay ? (
              <Text style={{ color: colors.green, fontFamily: fonts.semiBold, marginTop: 4 }}>{t('topUp.useForAutoPay')}</Text>
            ) : null}
          </Card>
        ))}

        <View style={{ marginTop: spacing.lg }}>
          <Button
            title={user?.autoPayEnabled ? t('topUp.disableAutoPay') : t('topUp.enrollAutoPay')}
            onPress={() => requireAuth(() => toggleAutoPay(!user?.autoPayEnabled))}
            variant={user?.autoPayEnabled ? 'outline' : 'primary'}
          />
        </View>
        {!isAuthenticated ? <PublicHomeFooter /> : null}
      </PageScrollView>
    </View>
  );
}
