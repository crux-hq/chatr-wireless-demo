import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';
import { AuthScreenShell } from '@/components/layout/AuthScreenShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

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

  return (
    <AuthScreenShell
      title={t('auth.registerTitle')}
      keyboard
      leading={
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(auth)'))}
          accessibilityLabel={t('common.back')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.lg }}>
          <ChevronLeft color={colors.primary} size={22} />
          <Text style={{ fontFamily: fonts.semiBold, color: colors.primary, fontSize: 16 }}>{t('common.back')}</Text>
        </Pressable>
      }>
      <Input label={t('auth.firstName')} value={firstName} onChangeText={setFirstName} />
      <Input label={t('auth.lastName')} value={lastName} onChangeText={setLastName} />
      <Input label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Input label={t('auth.phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label={t('auth.password')} value={password} onChangeText={setPassword} secureTextEntry />
      <Button title={t('auth.createAccount')} onPress={handleRegister} loading={loading} />

      <View style={{ marginTop: spacing.lg, alignItems: 'center' }}>
        <Text style={{ color: '#000000', fontFamily: fonts.regular, fontSize: 16 }}>
          {t('auth.hasAccount')}{' '}
          <Link href="/(auth)/sign-in" style={{ color: colors.primary, fontFamily: fonts.bold }}>
            {t('common.signIn')}
          </Link>
        </Text>
      </View>
    </AuthScreenShell>
  );
}
