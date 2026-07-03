import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react-native';
import { AppHeaderBar } from '@/components/layout/AppHeaderBar';
import { NavigationDrawer, type NavigationDrawerItem } from '@/components/layout/NavigationDrawer';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';

export function AuthenticatedHeader() {
  const { t } = useTranslation();
  const signOut = useAppStore((s) => s.signOut);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems: NavigationDrawerItem[] = [
    {
      label: t('header.dashboard'),
      onPress: () => router.push('/(tabs)'),
    },
    {
      label: t('more.profile'),
      onPress: () => router.push('/profile'),
    },
    {
      label: t('more.support'),
      onPress: () => router.push('/support'),
    },
    {
      label: t('more.signOut'),
      onPress: () => signOut(),
    },
  ];

  return (
    <>
      <AppHeaderBar
        trailing={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <LanguageToggle onDark={false} />
            <Pressable
              onPress={() => setMenuOpen(true)}
              accessibilityLabel={t('header.openAccountMenu')}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.lavender,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <User color={colors.primary} size={22} />
            </Pressable>
          </View>
        }
      />
      <NavigationDrawer items={menuItems} visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
