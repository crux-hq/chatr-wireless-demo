import { ScrollView, View, Text, Switch } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { getPlanById } from '@/lib/mock/plans';
import { colors, spacing } from '@/lib/theme/colors';

export default function AutoPayScreen() {
  const { t } = useTranslation();
  const user = useAppStore((s) => s.user);
  const toggleAutoPay = useAppStore((s) => s.toggleAutoPay);

  const plan = user ? getPlanById(user.planId) : null;

  return (
    <>
      <Stack.Screen options={{ title: t('topUp.autoPay'), headerShown: true }} />
      <ScrollView style={{ flex: 1, backgroundColor: colors.gray }} contentContainerStyle={{ padding: spacing.md }}>
        <Card>
          <Text style={{ fontWeight: '700', fontSize: 18 }}>{t('topUp.autoPayDesc')}</Text>
          {plan && plan.autoPayBonusGb > 0 ? (
            <Text style={{ marginTop: spacing.sm, color: colors.green, fontWeight: '600' }}>
              +{plan.autoPayBonusGb} GB bonus data every cycle
            </Text>
          ) : null}

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg }}>
            <Text style={{ fontWeight: '600' }}>{t('topUp.enrollAutoPay')}</Text>
            <Switch
              value={user?.autoPayEnabled ?? false}
              onValueChange={toggleAutoPay}
              trackColor={{ true: colors.green }}
            />
          </View>
        </Card>

        {user?.paymentMethods.map((card) => (
          <Card key={card.id} style={{ marginTop: spacing.md }}>
            <Text style={{ fontWeight: '700' }}>
              {card.brand} •••• {card.last4}
            </Text>
            <Text style={{ color: colors.grayDark }}>
              Exp {card.expiryMonth}/{card.expiryYear}
            </Text>
            {card.isAutoPay ? (
              <Text style={{ color: colors.green, fontWeight: '600', marginTop: 4 }}>{t('topUp.useForAutoPay')}</Text>
            ) : null}
          </Card>
        ))}

        <View style={{ marginTop: spacing.lg }}>
          <Button
            title={user?.autoPayEnabled ? t('topUp.disableAutoPay') : t('topUp.enrollAutoPay')}
            onPress={() => toggleAutoPay(!user?.autoPayEnabled)}
            variant={user?.autoPayEnabled ? 'outline' : 'primary'}
          />
        </View>
      </ScrollView>
    </>
  );
}
