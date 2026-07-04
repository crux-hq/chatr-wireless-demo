import { ScrollView, View, Text, Pressable, Switch } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { PLANS } from '@/lib/mock/plans';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/i18n';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function ActivatePlanScreen() {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const draft = useAppStore((s) => s.activationDraft);
  const setActivationDraft = useAppStore((s) => s.setActivationDraft);

  const dataPlans = PLANS.filter((p) => p.category === 'talk-text-data');

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{`3. ${t('activate.selectPlan')}`}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        {dataPlans.slice(0, 4).map((plan) => (
          <Pressable
            key={plan.id}
            onPress={() => setActivationDraft({ planId: plan.id })}
            style={{
              backgroundColor: colors.white,
              padding: spacing.md,
              borderRadius: 12,
              marginBottom: spacing.sm,
              borderWidth: draft.planId === plan.id ? 2 : 1,
              borderColor: draft.planId === plan.id ? colors.green : colors.grayMid,
            }}>
            <Text style={{ fontFamily: fonts.extraBold, fontSize: 18 }}>
              {plan.baseDataGb + plan.autoPayBonusGb} GB — {formatCurrency(plan.price, locale)}/mo
            </Text>
            <Text style={{ color: colors.grayDark, marginTop: 4 }}>
              {locale === 'fr' ? plan.nameFr : plan.nameEn}
            </Text>
          </Pressable>
        ))}

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: spacing.lg }}>
          <Text style={{ fontFamily: fonts.semiBold, flex: 1 }}>{t('activate.enableAutoPay')}</Text>
          <Switch
            value={draft.autoPay}
            onValueChange={(autoPay) => setActivationDraft({ autoPay })}
            trackColor={{ true: colors.green }}
          />
        </View>

        <Button title={t('common.continue')} onPress={() => router.push('/activate/account')} />
        <PublicHomeFooter bleedPadding={spacing.lg} />
      </PageScrollView>
    </View>
  );
}
