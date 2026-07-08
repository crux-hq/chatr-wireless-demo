import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { AuthScreenShell } from '@/components/layout/AuthScreenShell';
import { BackToAccountSettings } from '@/components/profile/BackToAccountSettings';
import { Button, Card } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AddOnSetupDialog } from '@/components/addons/AddOnSetupDialog';
import { navigateToAuthScreen } from '@/lib/nav-auth';
import { useAppStore } from '@/lib/store';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function CardsScreen() {
  const { t } = useTranslation();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const user = useAppStore((s) => s.user);
  const addPaymentMethod = useAppStore((s) => s.addPaymentMethod);
  const removePaymentMethod = useAppStore((s) => s.removePaymentMethod);
  const [showAdd, setShowAdd] = useState(false);
  const [last4, setLast4] = useState('');
  const [useAutoPay, setUseAutoPay] = useState(false);
  const [setupVisible, setSetupVisible] = useState(false);

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setSetupVisible(true);
      return;
    }
    action();
  };

  const handleAdd = () => {
    addPaymentMethod({
      brand: 'Visa',
      last4: last4.slice(-4) || '4242',
      expiryMonth: 12,
      expiryYear: 2028,
      isAutoPay: useAutoPay,
    });
    setShowAdd(false);
    setLast4('');
  };

  const cardsContent = (
    <>
      {user?.paymentMethods.map((card) => (
        <Card key={card.id} style={{ marginBottom: spacing.sm }}>
          <Text style={{ fontFamily: fonts.bold }}>
            {card.brand} •••• {card.last4}
          </Text>
          <Text style={{ color: colors.grayDark }}>
            Exp {card.expiryMonth}/{card.expiryYear}
          </Text>
          <Pressable onPress={() => removePaymentMethod(card.id)} style={{ marginTop: spacing.sm }}>
            <Text style={{ color: colors.red, fontFamily: fonts.semiBold }}>{t('topUp.deleteCard')}</Text>
          </Pressable>
        </Card>
      ))}

      {showAdd ? (
        <Card style={{ marginTop: spacing.md }}>
          <Input
            label={t('topUp.cardNumber')}
            value={last4}
            onChangeText={setLast4}
            keyboardType="numeric"
            placeholder="4242 4242 4242 4242"
          />
          <Pressable onPress={() => setUseAutoPay(!useAutoPay)} style={{ marginBottom: spacing.md }}>
            <Text style={{ color: colors.green }}>
              {useAutoPay ? '✓' : '○'} {t('topUp.useForAutoPay')}
            </Text>
          </Pressable>
          <Button title={t('common.save')} onPress={handleAdd} />
        </Card>
      ) : (
        <Button
          title={t('topUp.addCard')}
          onPress={() => requireAuth(() => setShowAdd(true))}
          style={{ marginTop: spacing.md }}
        />
      )}
      {!isAuthenticated ? <PublicHomeFooter /> : null}
    </>
  );

  return (
    <>
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
      {isAuthenticated ? (
        <View style={{ flex: 1, backgroundColor: colors.gray }}>
          <Header />
          <PageTitle leading={<BackToAccountSettings />}>{t('topUp.manageCards')}</PageTitle>
          <PageScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl }}>
            {cardsContent}
          </PageScrollView>
        </View>
      ) : (
        <AuthScreenShell title={t('topUp.manageCards')} contentStyle={{ paddingBottom: 100 }}>
          {cardsContent}
        </AuthScreenShell>
      )}
    </>
  );
}
