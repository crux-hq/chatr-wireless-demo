import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Header, PageTitle, PromoBanner, QuickLinkGrid } from '@/components/layout/Header';
import { Card, Badge, Section, SectionTitle } from '@/components/ui/Button';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ConfettiBurst } from '@/components/ui/ConfettiBurst';
import { BonusClaimDialog } from '@/components/ui/BonusClaimDialog';
import { useAppStore, useDataUsagePercent } from '@/lib/store';
import { getPlanById } from '@/lib/mock/plans';
import { getAddOnById } from '@/lib/mock/add-ons';
import { PROMOS } from '@/lib/mock/stores';
import { formatCurrency, formatDate, formatGb } from '@/lib/i18n';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

function BonusDataLabel({ gb, highlight }: { gb: number; highlight: boolean }) {
  const { t } = useTranslation();
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (highlight) {
      pulse.value = withRepeat(
        withSequence(withTiming(1, { duration: 500 }), withTiming(0.35, { duration: 500 })),
        3,
        false,
      );
    }
  }, [highlight, pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(255, 184, 28, ${pulse.value * 0.35})`,
    transform: [{ scale: 1 + pulse.value * 0.03 }],
  }));

  return (
    <Animated.View
      style={[
        {
          alignSelf: 'flex-start',
          marginTop: 4,
          paddingHorizontal: spacing.sm,
          paddingVertical: 2,
          borderRadius: radius.sm,
        },
        animatedStyle,
      ]}>
      <Text style={{ fontFamily: fonts.semiBold, color: colors.primary, fontSize: 15 }}>
        {t('dashboard.bonusData', { gb })}
      </Text>
    </Animated.View>
  );
}

export default function DashboardScreen() {
  const { t } = useTranslation();
  const user = useAppStore((s) => s.user);
  const locale = useAppStore((s) => s.locale);
  const claimAutoPayBonus = useAppStore((s) => s.claimAutoPayBonus);
  const usagePercent = useDataUsagePercent(user);
  const [confettiActive, setConfettiActive] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [highlightBonus, setHighlightBonus] = useState(false);

  const plan = user ? getPlanById(user.planId) : null;
  const bonusClaimed = user?.autoPayBonusClaimed ?? false;
  const canClaimBonus = Boolean(
    plan && plan.autoPayBonusGb > 0 && user?.autoPayEnabled && !bonusClaimed,
  );

  const handleClaimBonus = useCallback(async () => {
    if (!canClaimBonus) return;
    setConfettiActive(true);
    setDialogVisible(true);
    await claimAutoPayBonus();
    setHighlightBonus(true);
    setTimeout(() => setConfettiActive(false), 3000);
  }, [canClaimBonus, claimAutoPayBonus]);

  const handleCloseDialog = useCallback(() => {
    setDialogVisible(false);
  }, []);

  if (!user) return null;

  const planName = plan ? (locale === 'fr' ? plan.nameFr : plan.nameEn) : '';
  const dataRemaining = user.usage.dataLimitMb - user.usage.dataUsedMb;
  const showBonusLine = Boolean(plan && plan.autoPayBonusGb > 0 && bonusClaimed);

  const quickLinks = [
    { label: t('dashboard.topUp'), onPress: () => router.push('/top-up/pay') },
    { label: t('dashboard.addData'), onPress: () => router.push('/(tabs)/add-ons') },
    { label: t('dashboard.manageCard'), onPress: () => router.push('/top-up/cards') },
    { label: t('dashboard.viewUsage'), onPress: () => router.push('/(tabs)/usage') },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <ConfettiBurst active={confettiActive} />
      <BonusClaimDialog
        visible={dialogVisible}
        gb={plan?.autoPayBonusGb ?? 5}
        onClose={handleCloseDialog}
      />
      <Header />
      <PageTitle>{t('dashboard.greeting', { name: user.firstName })}</PageTitle>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <PromoBanner
          title={t('plans.featuredDeal')}
          subtitle={t('common.noContract')}
          onClaimBonus={canClaimBonus ? handleClaimBonus : undefined}
          bonusClaimed={bonusClaimed}
        />

        {usagePercent >= 75 ? (
          <Card style={{ marginBottom: spacing.md, backgroundColor: usagePercent >= 90 ? '#FFEBEE' : '#FFF3E0' }}>
            <Text style={{ fontFamily: fonts.bold, color: usagePercent >= 90 ? colors.red : colors.orange }}>
              {usagePercent >= 90 ? t('dashboard.usageAlert90') : t('dashboard.usageAlert75')}
            </Text>
          </Card>
        ) : null}

        <Card style={{ marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm }}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ fontFamily: fonts.regular, color: colors.grayDark }}>{t('dashboard.balance')}</Text>
              <Text style={{ fontSize: 28, fontFamily: fonts.extraBold, color: colors.black }}>
                {formatCurrency(user.balance, locale)}
              </Text>
              <Text style={{ fontFamily: fonts.regular, color: colors.grayDark, marginTop: 4, fontSize: 16 }}>
                {t('dashboard.anniversary')}: {formatDate(user.anniversaryDate, locale)}
              </Text>
            </View>
            <Badge
              label={user.autoPayEnabled ? t('dashboard.autoPayOn') : t('dashboard.autoPayOff')}
              color={user.autoPayEnabled ? colors.green : colors.grayDark}
              style={{ maxWidth: '46%' }}
            />
          </View>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <SectionTitle>{t('dashboard.yourPlan')}</SectionTitle>
          <Text style={{ fontSize: 20, fontFamily: fonts.bold, color: colors.green }}>{planName}</Text>
          {showBonusLine && plan ? (
            <BonusDataLabel gb={plan.autoPayBonusGb} highlight={highlightBonus} />
          ) : null}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: spacing.lg }}>
            <ProgressRing
              percent={usagePercent}
              label={t('dashboard.dataRemaining')}
              sublabel={formatGb(dataRemaining)}
              alert
              delay={0}
              replayOnFocus
            />
          </View>
        </Card>

        {user.activeAddOns.length > 0 ? (
          <Card style={{ marginBottom: spacing.md }}>
            <SectionTitle>{t('dashboard.activeAddons')}</SectionTitle>
            {user.activeAddOns.map((a) => {
              const addOn = getAddOnById(a.addOnId);
              if (!addOn) return null;
              return (
                <View key={a.addOnId} style={{ marginBottom: 8 }}>
                  <Text style={{ fontFamily: fonts.semiBold }}>{locale === 'fr' ? addOn.nameFr : addOn.nameEn}</Text>
                  <Text style={{ fontFamily: fonts.regular, color: colors.grayDark, fontSize: 16 }}>
                    {t('addons.activeUntil', { date: formatDate(a.expiresAt, locale) })}
                  </Text>
                </View>
              );
            })}
          </Card>
        ) : null}

        <Section title={t('dashboard.quickLinks')}>
          <QuickLinkGrid items={quickLinks} />
        </Section>

        <Section title={t('dashboard.promos')}>
          {PROMOS.map((promo) => (
            <Pressable key={promo.id} onPress={() => router.push(promo.route as '/support')}>
              <Card style={{ marginBottom: spacing.sm }}>
                <Text style={{ fontFamily: fonts.bold }}>{locale === 'fr' ? promo.titleFr : promo.titleEn}</Text>
                <Text style={{ fontFamily: fonts.regular, color: colors.grayDark, marginTop: 4 }}>
                  {locale === 'fr' ? promo.subtitleFr : promo.subtitleEn}
                </Text>
                <Text style={{ fontFamily: fonts.bold, color: colors.green, marginTop: 8 }}>
                  {locale === 'fr' ? promo.ctaFr : promo.ctaEn} →
                </Text>
              </Card>
            </Pressable>
          ))}
        </Section>
      </ScrollView>
    </View>
  );
}
