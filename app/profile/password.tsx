import { useState } from 'react';
import { ScrollView } from 'react-native';
import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, spacing } from '@/lib/theme/colors';

export default function ProfilePasswordScreen() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');

  return (
    <>
      <Stack.Screen options={{ title: t('profile.changePassword'), headerShown: true }} />
      <ScrollView style={{ flex: 1, backgroundColor: colors.gray }} contentContainerStyle={{ padding: spacing.md }}>
        <Input label={t('profile.currentPassword')} value={current} onChangeText={setCurrent} secureTextEntry />
        <Input label={t('profile.newPassword')} value={newPass} onChangeText={setNewPass} secureTextEntry />
        <Button title={t('common.save')} onPress={() => router.back()} />
      </ScrollView>
    </>
  );
}
