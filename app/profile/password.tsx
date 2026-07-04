import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { BackToAccountSettings } from '@/components/profile/BackToAccountSettings';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, spacing } from '@/lib/theme/colors';

export default function ProfilePasswordScreen() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle leading={<BackToAccountSettings />}>{t('profile.changePassword')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Input label={t('profile.currentPassword')} value={current} onChangeText={setCurrent} secureTextEntry />
        <Input label={t('profile.newPassword')} value={newPass} onChangeText={setNewPass} secureTextEntry />
        <Button title={t('common.save')} onPress={() => router.back()} />
      </PageScrollView>
    </View>
  );
}
