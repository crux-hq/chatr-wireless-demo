import { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';

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
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.gray }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title={t('auth.registerTitle')} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Input label={t('auth.firstName')} value={firstName} onChangeText={setFirstName} />
        <Input label={t('auth.lastName')} value={lastName} onChangeText={setLastName} />
        <Input label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Input label={t('auth.phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Input label={t('auth.password')} value={password} onChangeText={setPassword} secureTextEntry />
        <Button title={t('auth.createAccount')} onPress={handleRegister} loading={loading} />
        <Button title={t('common.back')} onPress={() => router.back()} variant="outline" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
