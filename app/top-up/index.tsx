import { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/i18n';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const AMOUNTS = [15, 19, 25, 29, 45];

export default function TopUpScreen() {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const user = useAppStore((s) => s.user);
  const topUp = useAppStore((s) => s.topUp);
  const [selected, setSelected] = useState(29);
  const [loading, setLoading] = useState(false);

  const handleTopUp = async () => {
    setLoading(true);
    await topUp(selected);
    setLoading(false);
    router.push('/top-up/success');
  };

  return (
    <>
      <Stack.Screen options={{ title: t('topUp.title'), headerShown: true }} />
      <ScrollView style={{ flex: 1, backgroundColor: colors.surface }} contentContainerStyle={{ padding: spacing.md }}>
        <Pressable onPress={() => router.push('/top-up/auto-pay')}>
          <Card style={{ marginBottom: spacing.md, backgroundColor: colors.lavenderMid }}>
            <Text style={{ fontFamily: fonts.bold }}>{t('topUp.autoPay')}</Text>
            <Text style={{ color: colors.textMuted, marginTop: 4, fontFamily: fonts.regular }}>{t('topUp.autoPayDesc')}</Text>
            <Text style={{ color: colors.primary, fontFamily: fonts.bold, marginTop: 8 }}>
              {user?.autoPayEnabled ? t('topUp.autoPayActive') : t('topUp.enrollAutoPay')} →
            </Text>
          </Card>
        </Pressable>

        <Text style={{ fontWeight: '700', marginBottom: spacing.sm }}>{t('topUp.oneTime')}</Text>
        <Text style={{ color: colors.grayDark, marginBottom: spacing.md }}>{t('topUp.selectAmount')}</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg }}>
          {AMOUNTS.map((amt) => (
            <Pressable
              key={amt}
              onPress={() => setSelected(amt)}
              style={{
                padding: spacing.md,
                borderRadius: 12,
                backgroundColor: selected === amt ? colors.primary : colors.surfaceElevated,
                minWidth: 80,
                alignItems: 'center',
              }}>
              <Text style={{ fontWeight: '700', color: selected === amt ? colors.white : colors.black }}>
                {formatCurrency(amt, locale)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => router.push('/top-up/cards')}>
          <Card style={{ marginBottom: spacing.lg }}>
            <Text style={{ fontWeight: '700' }}>{t('topUp.paymentMethod')}</Text>
            {user?.paymentMethods[0] ? (
              <Text style={{ marginTop: 4 }}>
                {user.paymentMethods[0].brand} •••• {user.paymentMethods[0].last4}
              </Text>
            ) : (
              <Text style={{ color: colors.green, marginTop: 4 }}>{t('topUp.addCard')} →</Text>
            )}
          </Card>
        </Pressable>

        <Button title={t('common.confirm')} onPress={handleTopUp} loading={loading} />
      </ScrollView>
    </>
  );
}
