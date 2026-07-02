import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/lib/store';
import { DEMO_PERSONAS } from '@/lib/mock/users';
import { colors, spacing } from '@/lib/theme/colors';

export default function SignInScreen() {
  const { t } = useTranslation();
  const signIn = useAppStore((s) => s.signIn);
  const locale = useAppStore((s) => s.locale);
  const [email, setEmail] = useState('demo@chatr.ca');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const { demo } = useLocalSearchParams<{ demo?: string }>();

  useEffect(() => {
    if (demo === '1') router.push('/demo');
  }, [demo]);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn(email, password);
    setLoading(false);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.gray }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color: colors.black }}>{t('auth.welcome')}</Text>
        <Text style={{ color: colors.grayDark, marginTop: 8, marginBottom: spacing.lg }}>{t('auth.signInSubtitle')}</Text>

        <Input label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Input label={t('auth.password')} value={password} onChangeText={setPassword} secureTextEntry />

        <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
          <Text style={{ color: colors.green, fontWeight: '600', marginBottom: spacing.lg }}>{t('auth.forgotPassword')}</Text>
        </Pressable>

        <Button title={t('common.signIn')} onPress={handleSignIn} loading={loading} />

        <View style={{ marginTop: spacing.lg, alignItems: 'center' }}>
          <Text style={{ color: colors.grayDark }}>
            {t('auth.noAccount')}{' '}
            <Link href="/(auth)/register" style={{ color: colors.green, fontWeight: '700' }}>
              {t('auth.createAccount')}
            </Link>
          </Text>
        </View>

        <Pressable onPress={() => router.push('/activate')} style={{ marginTop: spacing.md, alignItems: 'center' }}>
          <Text style={{ color: colors.green, fontWeight: '700' }}>{t('more.activate')}</Text>
        </Pressable>

        <Text style={{ fontWeight: '700', marginTop: spacing.xl, marginBottom: spacing.sm }}>{t('auth.demoAccounts')}</Text>
        {DEMO_PERSONAS.map((p) => (
          <Pressable
            key={p.email}
            onPress={() => {
              setEmail(p.email);
              setPassword('demo123');
            }}
            style={{
              backgroundColor: colors.white,
              padding: spacing.md,
              borderRadius: 12,
              marginBottom: spacing.sm,
              borderLeftWidth: 4,
              borderLeftColor: colors.green,
            }}>
            <Text style={{ fontWeight: '700' }}>{p.email}</Text>
            <Text style={{ color: colors.grayDark, fontSize: 13 }}>{locale === 'fr' ? p.labelFr : p.labelEn}</Text>
          </Pressable>
        ))}

        <Pressable onPress={() => router.push('/demo')} style={{ marginTop: spacing.md }}>
          <Text style={{ textAlign: 'center', color: colors.grayDark, fontSize: 12 }}>{t('more.demoMode')}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
