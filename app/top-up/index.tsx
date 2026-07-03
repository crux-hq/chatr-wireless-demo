import { ScrollView, View, Text, Pressable, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CirclePlus, Smartphone, RefreshCw, CreditCard, MessageSquare } from 'lucide-react-native';
import { Header, PageTitle } from '@/components/layout/Header';
import { PageSubtitle } from '@/components/layout/PageSubtitle';
import { Button, Card } from '@/components/ui/Button';
import { AddOnSetupDialog } from '@/components/addons/AddOnSetupDialog';
import { navigateToAuthScreen } from '@/lib/nav-auth';
import { launchPublicJourney } from '@/lib/nav-public';
import { useAppStore } from '@/lib/store';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';
import { useState } from 'react';

function LinkRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ paddingVertical: spacing.xs }}>
      <Text style={{ fontFamily: fonts.semiBold, color: colors.primary, fontSize: 16 }}>
        {label} →
      </Text>
    </Pressable>
  );
}

export default function TopUpLandingScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const [setupVisible, setSetupVisible] = useState(false);

  const cardWidth = width >= 720 ? '48%' : '100%';

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setSetupVisible(true);
      return;
    }
    action();
  };

  const handleSignInTopUp = () => {
    if (isAuthenticated) {
      router.push('/top-up/pay');
      return;
    }
    navigateToAuthScreen('/sign-in');
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
      <PageTitle>{t('topUp.landing.pageTitle')}</PageTitle>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}>
        <PageSubtitle style={{ marginBottom: spacing.lg }}>{t('topUp.landing.intro')}</PageSubtitle>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: spacing.md,
            marginBottom: spacing.xl,
          }}>
          <Card style={{ width: cardWidth, padding: spacing.lg }}>
            <CirclePlus size={40} color={colors.primary} strokeWidth={1.5} />
            <Text style={{ fontFamily: fonts.extraBold, fontSize: 20, marginTop: spacing.md, marginBottom: spacing.sm }}>
              {t('topUp.landing.guestTitle')}
            </Text>
            <Text style={{ color: colors.textMuted, lineHeight: 22, marginBottom: spacing.lg, flex: 1 }}>
              {t('topUp.landing.guestBody')}
            </Text>
            <Button
              title={t('topUp.landing.guestCta')}
              variant="secondary"
              onPress={() => router.push('/top-up/guest')}
            />
          </Card>

          <Card style={{ width: cardWidth, padding: spacing.lg }}>
            <Smartphone size={40} color={colors.primary} strokeWidth={1.5} />
            <Text style={{ fontFamily: fonts.extraBold, fontSize: 20, marginTop: spacing.md, marginBottom: spacing.sm }}>
              {isAuthenticated ? t('topUp.landing.signedInTitle') : t('topUp.landing.signInTitle')}
            </Text>
            <Text style={{ color: colors.textMuted, lineHeight: 22, marginBottom: spacing.lg, flex: 1 }}>
              {isAuthenticated ? t('topUp.landing.signedInBody') : t('topUp.landing.signInBody')}
            </Text>
            <Button
              title={isAuthenticated ? t('topUp.landing.signedInCta') : t('topUp.landing.signInCta')}
              variant="secondary"
              onPress={handleSignInTopUp}
            />
          </Card>
        </View>

        <Text style={{ fontFamily: fonts.extraBold, fontSize: 20, marginBottom: spacing.md }}>
          {t('topUp.landing.exploreTitle')}
        </Text>

        <Pressable onPress={() => launchPublicJourney('auto-pay')}>
          <Card
            style={{
              marginBottom: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.md,
              borderWidth: 1,
              borderColor: colors.grayMid,
            }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: radius.full,
                backgroundColor: colors.lavender,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <RefreshCw size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 16, marginBottom: 4 }}>
                {t('topUp.landing.autoPayBannerTitle')}
              </Text>
              <Text style={{ color: colors.textMuted, lineHeight: 20 }}>{t('topUp.landing.autoPayBannerBody')}</Text>
            </View>
            <Text style={{ fontFamily: fonts.bold, color: colors.primary }}>{t('topUp.landing.learnMore')} →</Text>
          </Card>
        </Pressable>

        <Card style={{ marginBottom: spacing.md, padding: 0, overflow: 'hidden' }}>
          <View style={{ backgroundColor: colors.primary, padding: spacing.lg, alignItems: 'center' }}>
            <CreditCard size={48} color={colors.white} strokeWidth={1.5} />
          </View>
          <View style={{ padding: spacing.lg }}>
            <Text style={{ fontFamily: fonts.extraBold, fontSize: 18, marginBottom: spacing.sm }}>
              {t('topUp.landing.cardStoreTitle')}
            </Text>
            <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
              <Text style={{ color: colors.textMuted, lineHeight: 22 }}>{t('topUp.landing.cardStoreBody1')}</Text>
              <Text style={{ color: colors.textMuted, lineHeight: 22 }}>{t('topUp.landing.cardStoreBody2')}</Text>
              <Text style={{ color: colors.textMuted, lineHeight: 22 }}>{t('topUp.landing.cardStoreBody3')}</Text>
            </View>
            <Pressable onPress={() => router.push('/stores')}>
              <Text style={{ fontFamily: fonts.bold, color: colors.primary }}>{t('topUp.landing.findStore')} →</Text>
            </Pressable>
          </View>
        </Card>

        <Card style={{ marginBottom: spacing.xl, padding: 0, overflow: 'hidden' }}>
          <View style={{ backgroundColor: colors.primary, padding: spacing.lg, alignItems: 'center' }}>
            <MessageSquare size={48} color={colors.accent} strokeWidth={1.5} />
          </View>
          <View style={{ padding: spacing.lg }}>
            <Text style={{ fontFamily: fonts.extraBold, fontSize: 18, marginBottom: spacing.sm }}>
              {t('topUp.landing.remindersTitle')}
            </Text>
            <Text style={{ color: colors.textMuted, lineHeight: 22, marginBottom: spacing.md }}>
              {t('topUp.landing.remindersBody')}
            </Text>
            <Pressable onPress={handleSignInTopUp}>
              <Text style={{ fontFamily: fonts.bold, color: colors.primary }}>
                {t('topUp.landing.remindersCta')} →
              </Text>
            </Pressable>
          </View>
        </Card>

        <Text style={{ fontFamily: fonts.extraBold, fontSize: 18, marginBottom: spacing.sm }}>
          {t('topUp.landing.learnMoreTitle')}
        </Text>
        <View style={{ marginBottom: spacing.lg }}>
          <LinkRow label={t('topUp.landing.linkHelp')} onPress={() => router.push('/support/topup-payment')} />
          <LinkRow
            label={t('topUp.landing.linkCards')}
            onPress={() => requireAuth(() => router.push('/top-up/cards'))}
          />
          <LinkRow
            label={t('topUp.landing.linkAutoPayCard')}
            onPress={() => requireAuth(() => router.push('/top-up/auto-pay'))}
          />
        </View>

        <PublicHomeFooter />
      </ScrollView>
    </View>
  );
}
