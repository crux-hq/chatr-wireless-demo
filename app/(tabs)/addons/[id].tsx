import { useCallback, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { BackToAddOns } from '@/components/addons/BackToAddOns';
import { Button, Card, Badge } from '@/components/ui/Button';
import { AddOnSetupDialog } from '@/components/addons/AddOnSetupDialog';
import { AddOnPurchaseConfirmDialog } from '@/components/addons/AddOnPurchaseConfirmDialog';
import { AddOnPurchaseSuccessDialog } from '@/components/addons/AddOnPurchaseSuccessDialog';
import { getAddOnById } from '@/lib/mock/add-ons';
import { navigateToAuthScreen } from '@/lib/nav-auth';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/i18n';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function AddOnDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const pendingAddOnId = useAppStore((s) => s.pendingAddOnId);
  const purchaseAddOn = useAppStore((s) => s.purchaseAddOn);
  const setPendingAddOn = useAppStore((s) => s.setPendingAddOn);
  const [loading, setLoading] = useState(false);
  const [setupVisible, setSetupVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [purchasedExpiresAt, setPurchasedExpiresAt] = useState('');

  const addOn = getAddOnById(id ?? '');

  const openConfirm = useCallback(() => {
    setConfirmVisible(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated && pendingAddOnId && addOn && pendingAddOnId === addOn.id) {
      setPendingAddOn(null);
      openConfirm();
    }
  }, [addOn, isAuthenticated, openConfirm, pendingAddOnId, setPendingAddOn]);

  if (!addOn) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.gray }}>
        <Header />
        <PageTitle leading={<BackToAddOns />} />
        <PageScrollView contentContainerStyle={{ padding: spacing.md }}>
          <Text>{t('errors.addonNotFound')}</Text>
        </PageScrollView>
      </View>
    );
  }

  const pageTitle = locale === 'fr' ? addOn.nameFr : addOn.nameEn;

  const handlePurchasePress = () => {
    if (!isAuthenticated) {
      setSetupVisible(true);
      return;
    }
    openConfirm();
  };

  const handleConfirmPurchase = async () => {
    setLoading(true);
    const result = await purchaseAddOn(addOn.id);
    setLoading(false);
    if (!result) return;
    setConfirmVisible(false);
    setPurchasedExpiresAt(result.expiresAt);
    setSuccessVisible(true);
  };

  const handleActivate = () => {
    setPendingAddOn(addOn.id);
    setSetupVisible(false);
    router.push('/activate');
  };

  const handleSignIn = () => {
    setPendingAddOn(addOn.id);
    setSetupVisible(false);
    navigateToAuthScreen('/sign-in');
  };

  const handleViewAccount = () => {
    setSuccessVisible(false);
    router.replace('/(tabs)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <AddOnSetupDialog
        visible={setupVisible}
        onClose={() => setSetupVisible(false)}
        onActivate={handleActivate}
        onSignIn={handleSignIn}
      />
      <AddOnPurchaseConfirmDialog
        visible={confirmVisible}
        addOn={addOn}
        locale={locale}
        loading={loading}
        onClose={() => setConfirmVisible(false)}
        onConfirm={() => void handleConfirmPurchase()}
      />
      <AddOnPurchaseSuccessDialog
        visible={successVisible}
        addOnName={pageTitle}
        expiresAt={purchasedExpiresAt}
        locale={locale}
        onClose={() => setSuccessVisible(false)}
        onViewAccount={handleViewAccount}
      />

      <Header />
      <PageTitle leading={<BackToAddOns />} />
      <PageScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: isAuthenticated ? spacing.md : 100 }}>
        <Card>
          <Badge label={t(`addons.categories.${addOn.category}`)} />
          <Text style={{ fontSize: 24, fontFamily: fonts.extraBold, marginTop: spacing.md }}>
            {locale === 'fr' ? addOn.nameFr : addOn.nameEn}
          </Text>
          <Text style={{ fontFamily: fonts.regular, color: colors.grayDark, marginTop: spacing.sm }}>
            {locale === 'fr' ? addOn.descriptionFr : addOn.descriptionEn}
          </Text>
          <Text style={{ fontSize: 28, fontFamily: fonts.extraBold, color: colors.green, marginTop: spacing.lg }}>
            {formatCurrency(addOn.price, locale)}
          </Text>
          {addOn.destinations ? (
            <Text style={{ fontFamily: fonts.regular, marginTop: spacing.sm, color: colors.grayDark }}>
              {addOn.destinations.join(', ')}
            </Text>
          ) : null}
        </Card>
        <View style={{ marginTop: spacing.lg }}>
          <Button title={t('addons.purchase')} onPress={handlePurchasePress} loading={loading && !confirmVisible} />
        </View>
        {!isAuthenticated ? <PublicHomeFooter /> : null}
      </PageScrollView>
    </View>
  );
}
