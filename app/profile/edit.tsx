import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header, PageTitle } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';

export default function ProfileEditScreen() {
  const { t } = useTranslation();
  const user = useAppStore((s) => s.user);
  const updateUser = useAppStore((s) => s.updateUser);
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [city, setCity] = useState(user?.city ?? '');
  const [postalCode, setPostalCode] = useState(user?.postalCode ?? '');

  const handleSave = () => {
    updateUser({ firstName, lastName, address, city, postalCode });
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('profile.accountInfo')}</PageTitle>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Input label={t('auth.firstName')} value={firstName} onChangeText={setFirstName} />
        <Input label={t('auth.lastName')} value={lastName} onChangeText={setLastName} />
        <Input label={t('profile.address')} value={address} onChangeText={setAddress} />
        <Input label={t('profile.city')} value={city} onChangeText={setCity} />
        <Input label={t('profile.postalCode')} value={postalCode} onChangeText={setPostalCode} />
        <Button title={t('common.save')} onPress={handleSave} />
      </ScrollView>
    </View>
  );
}
