import { useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AuthScreenShell } from '@/components/layout/AuthScreenShell';
import { PageSubtitle } from '@/components/layout/PageSubtitle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/sign-in');
    }
  };

  return (
    <AuthScreenShell title={t('auth.forgotTitle')}>
      <PageSubtitle>{t('auth.forgotSubtitle')}</PageSubtitle>
      {sent ? (
        <>
          <Text style={{ color: colors.green, fontFamily: fonts.semiBold, fontSize: 16, marginBottom: spacing.lg }}>{t('auth.resetSent')}</Text>
          <Button title={t('common.back')} onPress={goBack} variant="outline" />
        </>
      ) : (
        <>
          <Input label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" />
          <View style={{ gap: spacing.md }}>
            <Button title={t('common.confirm')} onPress={() => setSent(true)} />
            <Button title={t('common.back')} onPress={goBack} variant="outline" />
          </View>
        </>
      )}
    </AuthScreenShell>
  );
}
