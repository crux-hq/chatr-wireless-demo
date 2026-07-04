import { ScrollView, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { Card, SectionTitle, Button } from '@/components/ui/Button';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { DailyUsageChart } from '@/components/usage/DailyUsageChart';
import { useAppStore, useDataUsagePercent } from '@/lib/store';
import { getPlanById } from '@/lib/mock/plans';
import { PlanInclusions } from '@/components/plans/PlanInclusions';
import { formatCurrency, formatDate, formatGb } from '@/lib/i18n';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function UsageScreen() {
  const { t } = useTranslation();
  const user = useAppStore((s) => s.user);
  const locale = useAppStore((s) => s.locale);
  const usagePercent = useDataUsagePercent(user);

  if (!user) return null;

  const plan = getPlanById(user.planId);
  const planName = plan ? (locale === 'fr' ? plan.nameFr : plan.nameEn) : '';
  const { usage } = user;
  const chartData = usage.dailyDataMb.map((v, i) => ({
    value: v,
    label: `${i + 1}`,
    frontColor: colors.green,
  }));

  const talkPercent = usage.minutesLimit
    ? Math.round((usage.minutesUsed / usage.minutesLimit) * 100)
    : 0;
  const isUnlimitedTalk = !usage.minutesLimit;
  const textPercent = usage.textsLimit
    ? Math.round((usage.textsUsed / usage.textsLimit) * 100)
    : 0;
  const isUnlimitedText = !usage.textsLimit;

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('usage.title')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.md }}>
        {usagePercent >= 75 ? (
          <Card style={{ marginBottom: spacing.md, backgroundColor: usagePercent >= 90 ? '#FFEBEE' : '#FFF3E0' }}>
            <Text style={{ fontFamily: fonts.bold, marginBottom: spacing.sm }}>
              {usagePercent >= 90 ? t('dashboard.usageAlert90') : t('dashboard.usageAlert75')}
            </Text>
            <Button
              title={t('usage.addDataCta', { price: formatCurrency(10, locale) })}
              onPress={() => router.push('/addons/extra-data-5gb')}
              variant="secondary"
            />
          </Card>
        ) : null}

        <Card style={{ marginBottom: spacing.xl }}>
          <SectionTitle>{t('dashboard.yourPlan')}</SectionTitle>
          {plan ? (
            <>
              <Text style={{ fontSize: 20, fontFamily: fonts.bold, color: colors.primary }}>{planName}</Text>
              <PlanInclusions plan={plan} />
            </>
          ) : null}
        </Card>

        <Card style={{ marginBottom: spacing.xl }}>
          <Text style={{ color: colors.grayDark }}>{t('usage.cycle')}</Text>
          <Text style={{ fontFamily: fonts.semiBold }}>
            {formatDate(usage.cycleStart, locale)} — {formatDate(usage.cycleEnd, locale)}
          </Text>
          <Text style={{ color: colors.grayDark, marginTop: 4 }}>
            {t('usage.resetsOn', { date: formatDate(usage.cycleEnd, locale) })}
          </Text>
        </Card>

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
          <ProgressRing
            compact
            percent={usagePercent}
            label={t('usage.data')}
            sublabel={`${formatGb(usage.dataUsedMb)} / ${formatGb(usage.dataLimitMb)}`}
            alert
            delay={0}
            replayOnFocus
          />
          <ProgressRing
            compact
            unlimited={isUnlimitedTalk}
            percent={talkPercent}
            label={t('usage.talk')}
            sublabel={
              isUnlimitedTalk
                ? t('usage.talkMinutesUsed', { used: usage.minutesUsed })
                : t('usage.minutesUsed', { used: usage.minutesUsed, total: usage.minutesLimit })
            }
            color={colors.greenDark}
            delay={110}
            replayOnFocus
          />
          <ProgressRing
            compact
            unlimited={isUnlimitedText}
            percent={textPercent}
            label={t('usage.text')}
            sublabel={t('usage.textsUsed', { used: usage.textsUsed })}
            color={colors.primary}
            delay={220}
            replayOnFocus
          />
        </View>

        <Card style={{ marginBottom: spacing.md }}>
          <SectionTitle>{t('usage.dailyUsage')}</SectionTitle>
          {chartData.length > 0 ? (
            <DailyUsageChart data={chartData} />
          ) : (
            <Text style={{ color: colors.grayDark }}>{t('errors.noUsageData')}</Text>
          )}
        </Card>
      </PageScrollView>
    </View>
  );
}
