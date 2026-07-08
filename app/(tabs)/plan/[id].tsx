import { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';
import { Header } from '@/components/layout/Header';
import { Button, Card, Badge } from '@/components/ui/Button';
import { getPlanHighlight, PlanHighlightRibbon } from '@/components/plans/PlanHighlightRibbon';
import { PlanChangeConfirmDialog } from '@/components/plans/PlanChangeConfirmDialog';
import { PlanDataBreakdown, PlanDetailSections } from '@/components/plans/PlanDetailSections';
import { getPlanById } from '@/lib/mock/plans';
import { navigateToAuthScreen } from '@/lib/nav-auth';
import { startPlanCheckoutAndNavigate } from '@/lib/nav-public';
import { useAppStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/i18n';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const user = useAppStore((s) => s.user);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const confirmPlanChange = useAppStore((s) => s.confirmPlanChange);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const plan = getPlanById(id ?? '');
  if (!plan) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.gray }}>
        <Header />
        <View style={{ padding: spacing.md }}>
          <Pressable
            onPress={() => router.push(isAuthenticated ? '/(tabs)/plans' : '/plans')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.lg }}>
            <ChevronLeft size={20} color={colors.primary} />
            <Text style={{ color: colors.primary, fontFamily: fonts.semiBold }}>{t('plans.backToPlans')}</Text>
          </Pressable>
          <Text>{t('errors.planNotFound')}</Text>
        </View>
      </View>
    );
  }

  const isCurrent = user?.planId === plan.id;
  const currentPlan = user ? getPlanById(user.planId) : null;
  const advertisedTotalGb = plan.baseDataGb + plan.autoPayBonusGb;
  const highlight = getPlanHighlight(plan);
  const isYearlyBilling = plan.billingPeriod === 'yearly';

  const handleChange = async () => {
    if (!isAuthenticated || !user) {
      navigateToAuthScreen('/sign-in');
      return;
    }
    setLoading(true);
    const changed = await confirmPlanChange(plan.id);
    setLoading(false);
    if (!changed) return;
    setConfirmVisible(false);
    setSuccess(true);
    setTimeout(() => router.replace('/(tabs)'), 1500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <PlanChangeConfirmDialog
        visible={confirmVisible}
        plan={plan}
        currentPlan={currentPlan}
        effectiveDate={user?.anniversaryDate ?? ''}
        locale={locale}
        autoPayEnabled={user?.autoPayEnabled ?? true}
        loading={loading}
        onClose={() => setConfirmVisible(false)}
        onConfirm={() => void handleChange()}
      />
      <Header />
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingTop: spacing.lg, paddingBottom: isAuthenticated ? spacing.md : 100 }}>
        <Pressable
          onPress={() => router.push(isAuthenticated ? '/(tabs)/plans' : '/plans')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.lg }}>
          <ChevronLeft size={20} color={colors.primary} />
          <Text style={{ color: colors.primary, fontFamily: fonts.semiBold }}>{t('plans.backToPlans')}</Text>
        </Pressable>

        <Card
          style={{
            padding: 0,
            overflow: 'hidden',
            borderWidth: highlight ? 2 : undefined,
            borderColor: highlight === 'best-deal' ? colors.primary : highlight === 'yearly' ? colors.accent : undefined,
            backgroundColor: highlight === 'best-deal' ? colors.lavenderLight : colors.surfaceElevated,
          }}>
          {highlight ? <PlanHighlightRibbon highlight={highlight} /> : null}
          <View style={{ padding: spacing.lg }}>
            <Text style={{ fontSize: 36, fontFamily: fonts.extraBold }}>
              {plan.baseDataGb > 0 ? `${advertisedTotalGb} GB` : locale === 'fr' ? plan.nameFr : plan.nameEn}
            </Text>
            {plan.baseDataGb > 0 && plan.autoPayBonusGb > 0 ? (
              <Text style={{ color: colors.primary, marginTop: spacing.xs, fontFamily: fonts.bold }}>
                {t('plans.includesAutoPayBonus', { gb: plan.autoPayBonusGb })}
              </Text>
            ) : null}
            <Text style={{ fontSize: 28, fontFamily: fonts.bold, color: colors.primary, marginTop: spacing.sm }}>
              {formatCurrency(plan.price, locale)}
              {isYearlyBilling ? t('common.perYear') : t('common.perMonth')}
            </Text>
          </View>
        </Card>

        {plan.baseDataGb > 0 ? <PlanDataBreakdown plan={plan} locale={locale} /> : null}

        <PlanDetailSections plan={plan} locale={locale} />

        {isCurrent ? (
          <Badge label={t('plans.currentPlan')} color={colors.green} style={{ marginTop: spacing.lg }} />
        ) : isAuthenticated && user ? (
          <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
            {success ? (
              <Card style={{ backgroundColor: colors.lavenderMid }}>
                <Text style={{ fontFamily: fonts.bold, color: colors.primary, textAlign: 'center' }}>
                  {t('plans.changeSuccess')}
                </Text>
              </Card>
            ) : (
              <Button title={t('plans.changePlan')} onPress={() => setConfirmVisible(true)} loading={loading} />
            )}
            <Text style={{ color: colors.grayDark, textAlign: 'center' }}>
              {t('plans.changeEffective', { date: formatDate(user.anniversaryDate, locale) })}
            </Text>
          </View>
        ) : (
          <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
            <Button title={t('common.activateNow')} onPress={() => router.push('/activate')} />
            <Button
              title={t('common.buyNow')}
              onPress={() => startPlanCheckoutAndNavigate(plan.id)}
              variant="secondary"
            />
          </View>
        )}
        {!isAuthenticated ? <PublicHomeFooter /> : null}
      </ScrollView>
    </View>
  );
}
