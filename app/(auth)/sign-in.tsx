import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Link, router, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';
import { AuthScreenShell } from '@/components/layout/AuthScreenShell';
import { PageSubtitle } from '@/components/layout/PageSubtitle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function SignInScreen() {
  const { t } = useTranslation();
  const signIn = useAppStore((s) => s.signIn);
  const [email, setEmail] = useState('demo@chatr.ca');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn(email, password);
    setLoading(false);
    router.replace('/(tabs)');
  };

  return (
    <AuthScreenShell
      title={t('auth.welcome')}
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
      <PageSubtitle>{t('auth.signInSubtitle')}</PageSubtitle>

      <Input label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Input label={t('auth.password')} value={password} onChangeText={setPassword} secureTextEntry />

      <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
        <Text style={{ color: colors.primary, fontFamily: fonts.semiBold, marginBottom: spacing.lg }}>{t('auth.forgotPassword')}</Text>
      </Pressable>

      <Button title={t('common.signIn')} onPress={handleSignIn} loading={loading} />

      <View style={{ marginTop: spacing.lg, alignItems: 'center' }}>
        <Text style={{ color: '#000000', fontFamily: fonts.regular, fontSize: 16 }}>
          {t('auth.noAccount')}{' '}
          <Link href="/(auth)/register" style={{ color: colors.primary, fontFamily: fonts.bold }}>
            {t('auth.createAccount')}
          </Link>
        </Text>
      </View>

      <Pressable onPress={() => router.push('/buy-sim' as Href)} style={{ marginTop: spacing.md, alignItems: 'center' }}>
        <Text style={{ color: colors.primary, fontFamily: fonts.bold }}>{t('more.buySim')}</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/activate')} style={{ marginTop: spacing.sm, alignItems: 'center' }}>
        <Text style={{ color: colors.textMuted, fontFamily: fonts.semiBold }}>{t('more.activate')}</Text>
      </Pressable>
    </AuthScreenShell>
  );
}
