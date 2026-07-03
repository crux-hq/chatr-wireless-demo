import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AuthScreenShell } from '@/components/layout/AuthScreenShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/lib/store';
import { spacing } from '@/lib/theme/colors';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const signIn = useAppStore((s) => s.signIn);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    await signIn(email || 'new@chatr.ca', password);
    setLoading(false);
    router.replace('/(tabs)');
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/sign-in');
    }
  };

  return (
    <AuthScreenShell title={t('auth.registerTitle')} keyboard>
      <Input label={t('auth.firstName')} value={firstName} onChangeText={setFirstName} />
      <Input label={t('auth.lastName')} value={lastName} onChangeText={setLastName} />
      <Input label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Input label={t('auth.phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label={t('auth.password')} value={password} onChangeText={setPassword} secureTextEntry />
      <View style={{ gap: spacing.md }}>
        <Button title={t('auth.createAccount')} onPress={handleRegister} loading={loading} />
        <Button title={t('common.back')} onPress={goBack} variant="outline" />
      </View>
    </AuthScreenShell>
  );
}
