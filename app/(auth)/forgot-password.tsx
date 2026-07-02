import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, spacing } from '@/lib/theme/colors';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header title={t('auth.forgotTitle')} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={{ color: colors.grayDark, marginBottom: spacing.lg }}>{t('auth.forgotSubtitle')}</Text>
        {sent ? (
          <Text style={{ color: colors.green, fontWeight: '600', fontSize: 16 }}>{t('auth.resetSent')}</Text>
        ) : (
          <>
            <Input label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" />
            <Button title={t('common.confirm')} onPress={() => setSent(true)} />
          </>
        )}
        <Button title={t('common.back')} onPress={() => router.back()} variant="outline" />
      </ScrollView>
    </View>
  );
}
