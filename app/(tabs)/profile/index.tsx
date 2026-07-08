import { ScrollView, View, Text, Pressable } from 'react-native';
import { router, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react-native';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { Card } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const user = useAppStore((s) => s.user);

  if (!user) return null;

  const items = [
    { label: t('profile.accountInfo'), route: '/(tabs)/profile/edit' },
    { label: t('profile.changePassword'), route: '/(tabs)/profile/password' },
    { label: t('topUp.manageCards'), route: '/(tabs)/top-up/cards' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('profile.title')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={{ fontSize: 22, fontFamily: fonts.extraBold }}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={{ color: colors.grayDark }}>{user.email}</Text>
          <Text style={{ color: colors.grayDark }}>{user.phone}</Text>
        </Card>

        {items.map((item) => (
          <Pressable key={item.route} onPress={() => router.push(item.route as Href)}>
            <Card style={{ marginBottom: spacing.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.semiBold }}>{item.label}</Text>
              <ChevronRight color={colors.grayDark} size={20} />
            </Card>
          </Pressable>
        ))}

        <Card style={{ marginTop: spacing.md, backgroundColor: colors.lavenderMid }}>
          <Text style={{ fontFamily: fonts.semiBold }}>{t('profile.inStoreOnly')}</Text>
          <Text style={{ color: colors.grayDark, marginTop: 4 }}>{t('profile.birthdate')}</Text>
          <Text style={{ color: colors.grayDark, marginTop: 4 }}>{t('profile.authorizedContact')}</Text>
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <Text style={{ fontFamily: fonts.bold }}>{t('profile.mfa')}</Text>
          <Text style={{ color: colors.green, marginTop: 4 }}>{t('profile.mfaEnabled')}</Text>
        </Card>
      </PageScrollView>
    </View>
  );
}
