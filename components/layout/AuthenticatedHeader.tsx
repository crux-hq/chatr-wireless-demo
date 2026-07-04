import { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppHeaderBar } from '@/components/layout/AppHeaderBar';
import { NavigationDrawer, type NavigationDrawerItem } from '@/components/layout/NavigationDrawer';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

function getUserInitials(firstName: string, lastName: string) {
  const first = firstName.trim()[0] ?? '';
  const last = lastName.trim()[0] ?? '';
  return (first + last).toUpperCase() || '?';
}

export function AuthenticatedHeader() {
  const { t } = useTranslation();
  const signOut = useAppStore((s) => s.signOut);
  const user = useAppStore((s) => s.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = user ? getUserInitials(user.firstName, user.lastName) : '?';

  const menuItems: NavigationDrawerItem[] = [
    {
      label: t('more.profile'),
      onPress: () => router.push('/profile'),
    },
    {
      label: t('more.support'),
      onPress: () => router.push('/support'),
    },
  ];

  const footerActions = [
    {
      label: t('header.dashboard'),
      variant: 'primary' as const,
      onPress: () => router.push('/(tabs)'),
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
              <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.primary }}>{initials}</Text>
            </Pressable>
          </View>
        }
      />
      <NavigationDrawer
        items={menuItems}
        footerActions={footerActions}
        footerSecondaryLink={{
          prefix: '',
          label: t('more.signOut'),
          onPress: () => signOut(),
        }}
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
