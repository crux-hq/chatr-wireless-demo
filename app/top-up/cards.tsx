import { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';

export default function CardsScreen() {
  const { t } = useTranslation();
  const user = useAppStore((s) => s.user);
  const addPaymentMethod = useAppStore((s) => s.addPaymentMethod);
  const removePaymentMethod = useAppStore((s) => s.removePaymentMethod);
  const [showAdd, setShowAdd] = useState(false);
  const [last4, setLast4] = useState('');
  const [useAutoPay, setUseAutoPay] = useState(false);

  const handleAdd = () => {
    addPaymentMethod({
      brand: 'Visa',
      last4: last4.slice(-4) || '4242',
      expiryMonth: 12,
      expiryYear: 2028,
      isAutoPay: useAutoPay,
    });
    setShowAdd(false);
    setLast4('');
  };

  return (
    <>
      <Stack.Screen options={{ title: t('topUp.manageCards'), headerShown: true }} />
      <ScrollView style={{ flex: 1, backgroundColor: colors.gray }} contentContainerStyle={{ padding: spacing.md }}>
        {user?.paymentMethods.map((card) => (
          <Card key={card.id} style={{ marginBottom: spacing.sm }}>
            <Text style={{ fontWeight: '700' }}>
              {card.brand} •••• {card.last4}
            </Text>
            <Text style={{ color: colors.grayDark }}>
              Exp {card.expiryMonth}/{card.expiryYear}
            </Text>
            <Pressable onPress={() => removePaymentMethod(card.id)} style={{ marginTop: spacing.sm }}>
              <Text style={{ color: colors.red, fontWeight: '600' }}>{t('topUp.deleteCard')}</Text>
            </Pressable>
          </Card>
        ))}

        {showAdd ? (
          <Card style={{ marginTop: spacing.md }}>
            <Input label={t('topUp.cardNumber')} value={last4} onChangeText={setLast4} keyboardType="numeric" placeholder="4242 4242 4242 4242" />
            <Pressable onPress={() => setUseAutoPay(!useAutoPay)} style={{ marginBottom: spacing.md }}>
              <Text style={{ color: colors.green }}>{useAutoPay ? '✓' : '○'} {t('topUp.useForAutoPay')}</Text>
            </Pressable>
            <Button title={t('common.save')} onPress={handleAdd} />
          </Card>
        ) : (
          <Button title={t('topUp.addCard')} onPress={() => setShowAdd(true)} variant="outline" />
        )}
      </ScrollView>
    </>
  );
}
