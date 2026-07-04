import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react-native';
import { AppHeaderBar } from '@/components/layout/AppHeaderBar';
import { NavigationDrawer, type NavigationDrawerItem } from '@/components/layout/NavigationDrawer';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { CartButton } from '@/components/layout/CartButton';
import { navigateToAuthScreen } from '@/lib/nav-auth';
import { colors, spacing } from '@/lib/theme/colors';

const PUBLIC_MENU_ITEMS: { labelKey: string; route: string }[] = [
  { labelKey: 'nav.plans', route: '/plans' },
  { labelKey: 'nav.phones', route: '/phones' },
  { labelKey: 'nav.buySim', route: '/buy-sim' },
  { labelKey: 'nav.activateSim', route: '/activate' },
  { labelKey: 'nav.coverage', route: '/coverage' },
  { labelKey: 'nav.stores', route: '/stores' },
  { labelKey: 'nav.support', route: '/support' },
];

export function PublicHeader() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems: NavigationDrawerItem[] = PUBLIC_MENU_ITEMS.map((item) => ({
    label: t(item.labelKey),
    onPress: () => {
      if (item.route === '/sign-in' || item.route === '/register') {
        navigateToAuthScreen(item.route as '/sign-in' | '/register');
      } else {
        router.push(item.route as '/plans');
      }
    },
  }));

  const footerActions = [
    {
      label: t('nav.topUp'),
      variant: 'primary' as const,
      onPress: () => router.push('/top-up'),
    },
    {
      label: t('nav.signIn'),
      variant: 'outline' as const,
      onPress: () => navigateToAuthScreen('/sign-in'),
    },
  ];

  return (
    <>
      <AppHeaderBar
        trailing={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <LanguageToggle onDark={false} />
            <CartButton />
            <Pressable
              onPress={() => setMenuOpen(true)}
              accessibilityLabel="Open menu"
              style={{
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Menu color={colors.primary} size={26} />
            </Pressable>
          </View>
        }
      />
      <NavigationDrawer
        items={menuItems}
        footerActions={footerActions}
        footerSecondaryLink={{
          prefix: `${t('nav.or')} `,
          label: t('nav.createAccount'),
          onPress: () => navigateToAuthScreen('/register'),
        }}
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
