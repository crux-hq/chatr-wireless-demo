import { useState } from 'react';
import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/layout/Header';
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
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.surface }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={{ fontFamily: fonts.extraBold, fontSize: 28, color: colors.text }}>{t('auth.welcome')}</Text>
        <Text style={{ color: colors.textMuted, marginTop: 8, marginBottom: spacing.lg, fontFamily: fonts.regular, lineHeight: 22 }}>
          {t('auth.signInSubtitle')}
        </Text>

        <Input label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Input label={t('auth.password')} value={password} onChangeText={setPassword} secureTextEntry />

        <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
          <Text style={{ color: colors.primary, fontFamily: fonts.semiBold, marginBottom: spacing.lg }}>{t('auth.forgotPassword')}</Text>
        </Pressable>

        <Button title={t('common.signIn')} onPress={handleSignIn} loading={loading} />

        <View style={{ marginTop: spacing.lg, alignItems: 'center' }}>
          <Text style={{ color: colors.grayDark }}>
            {t('auth.noAccount')}{' '}
            <Link href="/(auth)/register" style={{ color: colors.primary, fontFamily: fonts.bold }}>
              {t('auth.createAccount')}
            </Link>
          </Text>
        </View>

        <Pressable onPress={() => router.push('/activate')} style={{ marginTop: spacing.md, alignItems: 'center' }}>
          <Text style={{ color: colors.primary, fontFamily: fonts.bold }}>{t('more.activate')}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
