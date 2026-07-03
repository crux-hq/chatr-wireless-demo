import { ScrollView, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header, PageTitle } from '@/components/layout/Header';
import { Card, SectionTitle, Button } from '@/components/ui/Button';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { DailyUsageChart } from '@/components/usage/DailyUsageChart';
import { useAppStore, useDataUsagePercent } from '@/lib/store';
import { formatCurrency, formatDate, formatGb } from '@/lib/i18n';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function UsageScreen() {
  const { t } = useTranslation();
  const user = useAppStore((s) => s.user);
  const locale = useAppStore((s) => s.locale);
  const usagePercent = useDataUsagePercent(user);

  if (!user) return null;

  const { usage } = user;
  const chartData = usage.dailyDataMb.map((v, i) => ({
    value: v,
    label: `${i + 1}`,
    frontColor: colors.green,
  }));

  const talkPercent = usage.minutesLimit
    ? Math.round((usage.minutesUsed / usage.minutesLimit) * 100)
    : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('usage.title')}</PageTitle>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
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
          <Text style={{ color: colors.grayDark }}>{t('usage.cycle')}</Text>
          <Text style={{ fontFamily: fonts.semiBold }}>
            {formatDate(usage.cycleStart, locale)} — {formatDate(usage.cycleEnd, locale)}
          </Text>
          <Text style={{ color: colors.grayDark, marginTop: 4 }}>
            {t('usage.resetsOn', { date: formatDate(usage.cycleEnd, locale) })}
          </Text>
        </Card>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.lg }}>
          <ProgressRing
            percent={usagePercent}
            label={t('usage.data')}
            sublabel={`${formatGb(usage.dataUsedMb)} / ${formatGb(usage.dataLimitMb)}`}
            alert
            delay={0}
            replayOnFocus
          />
          <ProgressRing
            percent={usage.minutesLimit ? talkPercent : 15}
            label={t('usage.talk')}
            sublabel={
              usage.minutesLimit
                ? t('usage.minutesUsed', { used: usage.minutesUsed, total: usage.minutesLimit })
                : t('usage.unlimited')
            }
            color={colors.greenDark}
            delay={110}
            replayOnFocus
          />
        </View>

        <Card style={{ marginBottom: spacing.md, alignItems: 'center' }}>
          <SectionTitle>{t('usage.dailyUsage')}</SectionTitle>
          {chartData.length > 0 ? (
            <DailyUsageChart data={chartData} />
          ) : (
            <Text style={{ color: colors.grayDark }}>{t('errors.noUsageData')}</Text>
          )}
        </Card>

        <Card>
          <Text style={{ fontFamily: fonts.bold, fontSize: 16 }}>{t('usage.text')}</Text>
          <Text style={{ color: colors.grayDark, marginTop: 4 }}>
            {usage.textsLimit
              ? t('usage.textsUsed', { used: usage.textsUsed })
              : `${t('usage.unlimited')} — ${usage.textsUsed} ${t('usage.text').toLowerCase()}`}
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}
