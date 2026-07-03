import type { ReactNode } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/lib/store';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

function StateSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: colors.lavender,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.grayMid,
      }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.primary, marginBottom: spacing.sm }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function StateRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.md,
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: colors.grayMid + '80',
      }}>
      <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.textMuted, flex: 1 }}>{label}</Text>
      <Text
        style={{
          fontFamily: fonts.semiBold,
          fontSize: 14,
          color: colors.text,
          flex: 1,
          textAlign: 'right',
        }}>
        {value}
      </Text>
    </View>
  );
}

function formatBool(value: boolean) {
  return value ? 'Yes' : 'No';
}

function formatOptional(value: string | null | undefined) {
  return value && value.length > 0 ? value : '—';
}

export function DemoAppStatePanel() {
  const { t } = useTranslation();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const locale = useAppStore((s) => s.locale);
  const currentScenario = useAppStore((s) => s.currentScenario);
  const selectedPlanId = useAppStore((s) => s.selectedPlanId);
  const pendingPlanChangeId = useAppStore((s) => s.pendingPlanChangeId);
  const pendingAddOnId = useAppStore((s) => s.pendingAddOnId);
  const activationDraft = useAppStore((s) => s.activationDraft);
  const user = useAppStore((s) => s.user);

  const dataGb = user ? (user.usage.dataUsedMb / 1024).toFixed(1) : null;
  const dataLimitGb = user ? (user.usage.dataLimitMb / 1024).toFixed(1) : null;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.lg }}
      keyboardShouldPersistTaps="handled">
      <StateSection title={t('demo.stateSession')}>
        <StateRow label={t('demo.stateAuthenticated')} value={formatBool(isAuthenticated)} />
        <StateRow label={t('demo.stateLocale')} value={locale.toUpperCase()} />
        <StateRow label={t('demo.stateScenario')} value={currentScenario} />
      </StateSection>

      <StateSection title={t('demo.statePending')}>
        <StateRow label={t('demo.stateSelectedPlan')} value={formatOptional(selectedPlanId)} />
        <StateRow label={t('demo.statePendingPlan')} value={formatOptional(pendingPlanChangeId)} />
        <StateRow label={t('demo.statePendingAddOn')} value={formatOptional(pendingAddOnId)} />
      </StateSection>

      <StateSection title={t('demo.stateActivation')}>
        <StateRow label={t('demo.stateSimNumber')} value={formatOptional(activationDraft.simNumber)} />
        <StateRow label={t('demo.statePhone')} value={formatOptional(activationDraft.phoneNumber)} />
        <StateRow label={t('demo.stateDraftPlan')} value={activationDraft.planId} />
        <StateRow label={t('demo.stateDraftAutoPay')} value={formatBool(activationDraft.autoPay)} />
      </StateSection>

      {user ? (
        <>
          <StateSection title={t('demo.stateUser')}>
            <StateRow label={t('auth.email')} value={user.email} />
            <StateRow label={t('demo.statePlan')} value={user.planId} />
            <StateRow label={t('demo.stateBalance')} value={`$${user.balance.toFixed(2)}`} />
            <StateRow label={t('demo.stateAutoPay')} value={formatBool(user.autoPayEnabled)} />
            <StateRow label={t('demo.stateBonusClaimed')} value={formatBool(user.autoPayBonusClaimed ?? false)} />
            <StateRow label={t('demo.stateAddOns')} value={String(user.activeAddOns.length)} />
            <StateRow label={t('demo.stateCards')} value={String(user.paymentMethods.length)} />
          </StateSection>

          <StateSection title={t('demo.stateUsage')}>
            <StateRow label={t('demo.stateData')} value={`${dataGb} / ${dataLimitGb} GB`} />
            <StateRow label={t('demo.stateCycle')} value={`${user.usage.cycleStart} → ${user.usage.cycleEnd}`} />
            <StateRow label={t('demo.stateTransactions')} value={String(user.transactions.length)} />
          </StateSection>
        </>
      ) : (
        <View
          style={{
            padding: spacing.lg,
            alignItems: 'center',
            backgroundColor: colors.surfaceElevated,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.grayMid,
          }}>
          <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.textMuted, textAlign: 'center' }}>
            {t('demo.stateNoUser')}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
