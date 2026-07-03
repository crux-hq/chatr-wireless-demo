import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header, PageTitle } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/lib/store';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing } from '@/lib/theme/colors';

export default function ActivateAccountScreen() {
  const { t } = useTranslation();
  const completeActivation = useAppStore((s) => s.completeActivation);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Singh');
  const [email, setEmail] = useState('new@chatr.ca');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    await completeActivation({ firstName, lastName, email, phone: '' });
    setLoading(false);
    router.replace('/activate/success');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{`4. ${t('activate.step4')}`}</PageTitle>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        <Input label={t('auth.firstName')} value={firstName} onChangeText={setFirstName} />
        <Input label={t('auth.lastName')} value={lastName} onChangeText={setLastName} />
        <Input label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Input label={t('auth.password')} value={password} onChangeText={setPassword} secureTextEntry />
        <Button title={t('common.confirm')} onPress={handleComplete} loading={loading} />
        <PublicHomeFooter bleedPadding={spacing.lg} />
      </ScrollView>
    </View>
  );
}
