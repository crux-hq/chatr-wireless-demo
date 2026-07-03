import { ScrollView, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header, PromoBanner, QuickLinkGrid } from '@/components/layout/Header';
import { Card, Badge, Section, SectionTitle } from '@/components/ui/Button';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useAppStore, useDataUsagePercent } from '@/lib/store';
import { getPlanById } from '@/lib/mock/plans';
import { getAddOnById } from '@/lib/mock/add-ons';
import { PROMOS } from '@/lib/mock/stores';
import { formatCurrency, formatDate, formatGb } from '@/lib/i18n';
import { colors, spacing } from '@/lib/theme/colors';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const user = useAppStore((s) => s.user);
  const locale = useAppStore((s) => s.locale);
  const usagePercent = useDataUsagePercent(user);

  if (!user) return null;

  const plan = getPlanById(user.planId);
  const planName = plan ? (locale === 'fr' ? plan.nameFr : plan.nameEn) : '';
  const dataRemaining = user.usage.dataLimitMb - user.usage.dataUsedMb;

  const quickLinks = [
    { label: t('dashboard.topUp'), onPress: () => router.push('/top-up') },
    { label: t('dashboard.addData'), onPress: () => router.push('/(tabs)/add-ons') },
    { label: t('dashboard.manageCard'), onPress: () => router.push('/top-up/cards') },
    { label: t('dashboard.viewUsage'), onPress: () => router.push('/(tabs)/usage') },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header title={t('dashboard.greeting', { name: user.firstName })} />
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <PromoBanner title={t('plans.featuredDeal')} subtitle={t('common.noContract')} />

        {usagePercent >= 75 ? (
          <Card style={{ marginBottom: spacing.md, backgroundColor: usagePercent >= 90 ? '#FFEBEE' : '#FFF3E0' }}>
            <Text style={{ fontWeight: '700', color: usagePercent >= 90 ? colors.red : colors.orange }}>
              {usagePercent >= 90 ? t('dashboard.usageAlert90') : t('dashboard.usageAlert75')}
            </Text>
          </Card>
        ) : null}

        <Card style={{ marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ color: colors.grayDark }}>{t('dashboard.balance')}</Text>
              <Text style={{ fontSize: 28, fontWeight: '800', color: colors.black }}>
                {formatCurrency(user.balance, locale)}
              </Text>
              <Text style={{ color: colors.grayDark, marginTop: 4, fontSize: 16 }}>
                {t('dashboard.anniversary')}: {formatDate(user.anniversaryDate, locale)}
              </Text>
            </View>
            <Badge
              label={user.autoPayEnabled ? t('dashboard.autoPayOn') : t('dashboard.autoPayOff')}
              color={user.autoPayEnabled ? colors.green : colors.grayDark}
            />
          </View>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <SectionTitle>{t('dashboard.yourPlan')}</SectionTitle>
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.green }}>{planName}</Text>
          {plan && plan.autoPayBonusGb > 0 && user.autoPayEnabled ? (
            <Text style={{ color: colors.grayDark, marginTop: 4 }}>
              {t('dashboard.bonusData', { gb: plan.autoPayBonusGb })}
            </Text>
          ) : null}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: spacing.lg }}>
            <ProgressRing
              percent={usagePercent}
              label={t('dashboard.dataRemaining')}
              sublabel={formatGb(dataRemaining)}
              alert
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
                  <Text style={{ fontWeight: '600' }}>{locale === 'fr' ? addOn.nameFr : addOn.nameEn}</Text>
                  <Text style={{ color: colors.grayDark, fontSize: 16 }}>
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
                <Text style={{ fontWeight: '700' }}>{locale === 'fr' ? promo.titleFr : promo.titleEn}</Text>
                <Text style={{ color: colors.grayDark, marginTop: 4 }}>
                  {locale === 'fr' ? promo.subtitleFr : promo.subtitleEn}
                </Text>
                <Text style={{ color: colors.green, fontWeight: '700', marginTop: 8 }}>
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
