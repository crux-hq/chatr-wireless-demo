import { ScrollView, View, Text, Pressable } from 'react-native';
import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react-native';
import { Card } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const user = useAppStore((s) => s.user);

  if (!user) return null;

  const items = [
    { label: t('profile.accountInfo'), route: '/profile/edit' },
    { label: t('profile.changePassword'), route: '/profile/password' },
    { label: t('topUp.manageCards'), route: '/top-up/cards' },
  ];

  return (
    <>
      <Stack.Screen options={{ title: t('profile.title'), headerShown: true }} />
      <ScrollView style={{ flex: 1, backgroundColor: colors.gray }} contentContainerStyle={{ padding: spacing.md }}>
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={{ fontSize: 22, fontWeight: '800' }}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={{ color: colors.grayDark }}>{user.email}</Text>
          <Text style={{ color: colors.grayDark }}>{user.phone}</Text>
        </Card>

        {items.map((item) => (
          <Pressable key={item.route} onPress={() => router.push(item.route as '/profile/edit')}>
            <Card style={{ marginBottom: spacing.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontWeight: '600' }}>{item.label}</Text>
              <ChevronRight color={colors.grayDark} size={20} />
            </Card>
          </Pressable>
        ))}

        <Card style={{ marginTop: spacing.md, backgroundColor: colors.yellowLight }}>
          <Text style={{ fontWeight: '600' }}>{t('profile.inStoreOnly')}</Text>
          <Text style={{ color: colors.grayDark, marginTop: 4 }}>{t('profile.birthdate')}</Text>
          <Text style={{ color: colors.grayDark, marginTop: 4 }}>{t('profile.authorizedContact')}</Text>
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <Text style={{ fontWeight: '700' }}>{t('profile.mfa')}</Text>
          <Text style={{ color: colors.green, marginTop: 4 }}>{t('profile.mfaEnabled')}</Text>
        </Card>
      </ScrollView>
    </>
  );
}
