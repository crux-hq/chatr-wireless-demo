import { ScrollView, View, Text } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Card, Badge } from '@/components/ui/Button';
import { getPlanById, getTotalDataGb } from '@/lib/mock/plans';
import { useAppStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/i18n';
import { colors, spacing } from '@/lib/theme/colors';

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const user = useAppStore((s) => s.user);
  const setPendingPlanChange = useAppStore((s) => s.setPendingPlanChange);
  const confirmPlanChange = useAppStore((s) => s.confirmPlanChange);

  const plan = getPlanById(id ?? '');
  if (!plan) return <Text>Plan not found</Text>;

  const isCurrent = user?.planId === plan.id;
  const totalGb = getTotalDataGb(plan, true);

  const handleChange = async () => {
    setPendingPlanChange(plan.id);
    await confirmPlanChange();
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: locale === 'fr' ? plan.nameFr : plan.nameEn, headerShown: true }} />
      <ScrollView style={{ flex: 1, backgroundColor: colors.gray }} contentContainerStyle={{ padding: spacing.md }}>
        {plan.featured ? <Badge label="35 GB for $29" color={colors.yellow} /> : null}
        <Text style={{ fontSize: 36, fontWeight: '800', marginTop: spacing.md }}>
          {plan.baseDataGb > 0 ? `${totalGb} GB` : locale === 'fr' ? plan.nameFr : plan.nameEn}
        </Text>
        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.green, marginTop: 8 }}>
          {formatCurrency(plan.price, locale)}
          {t('common.perMonth')}
        </Text>

        <Card style={{ marginTop: spacing.lg }}>
          <Text style={{ fontWeight: '700' }}>{t('plans.basePlan')}</Text>
          <Text>{plan.baseDataGb} GB</Text>
          <Text style={{ fontWeight: '700', marginTop: spacing.sm }}>{t('plans.autoPayBonus')}</Text>
          <Text>+{plan.autoPayBonusGb} GB</Text>
          <Text style={{ fontWeight: '700', marginTop: spacing.sm }}>{t('plans.totalData')}</Text>
          <Text>{totalGb} GB</Text>
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <Text>{locale === 'fr' ? plan.talkFr : plan.talkEn}</Text>
          <Text style={{ marginTop: 4 }}>{locale === 'fr' ? plan.textFr : plan.textEn}</Text>
        </Card>

        {isCurrent ? (
          <Badge label={t('plans.currentPlan')} color={colors.green} />
        ) : user ? (
          <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
            <Button title={t('plans.changePlan')} onPress={handleChange} />
            <Text style={{ color: colors.grayDark, textAlign: 'center' }}>
              {t('plans.changeEffective', { date: formatDate(user.anniversaryDate, locale) })}
            </Text>
          </View>
        ) : (
          <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
            <Button title={t('common.activateNow')} onPress={() => router.push('/activate')} />
            <Button title={t('common.buyNow')} onPress={() => router.push('/activate')} variant="secondary" />
          </View>
        )}
      </ScrollView>
    </>
  );
}
