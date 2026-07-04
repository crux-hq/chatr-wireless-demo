import { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react-native';
import { useAppStore } from '@/lib/store';
import { AppHeaderBar } from '@/components/layout/AppHeaderBar';
import { AuthenticatedHeader } from '@/components/layout/AuthenticatedHeader';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { CartButton } from '@/components/layout/CartButton';
import { NavigationDrawer, type NavigationDrawerItem } from '@/components/layout/NavigationDrawer';
import { isAuthScreenRoute, navigateToAuthScreen } from '@/lib/nav-auth';
import { colors, spacing } from '@/lib/theme/colors';

const MENU_ITEMS = [
  { labelKey: 'nav.plans', journeyId: 'browse-plans' },
  { labelKey: 'nav.phones', journeyId: 'browse-phones' },
  { labelKey: 'nav.buySim', journeyId: 'buy-sim' },
  { labelKey: 'nav.activateSim', journeyId: 'activate' },
  { labelKey: 'nav.coverage', journeyId: 'coverage' },
  { labelKey: 'nav.stores', journeyId: 'stores' },
  { labelKey: 'nav.support', journeyId: 'support' },
];

type MarketingHeaderProps = {
  onLaunchJourney: (journeyId: string) => void;
};

export function MarketingHeader({ onLaunchJourney }: MarketingHeaderProps) {
  const { t } = useTranslation();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const [menuOpen, setMenuOpen] = useState(false);

  if (isAuthenticated) {
    return (
      <View style={styles.wrapper}>
        <AuthenticatedHeader />
      </View>
    );
  }

  const menuItems: NavigationDrawerItem[] = MENU_ITEMS.map((item) => ({
    label: t(item.labelKey),
    onPress: () => {
      if ('route' in item && isAuthScreenRoute(item.route)) {
        navigateToAuthScreen(item.route);
      } else if ('journeyId' in item) {
        onLaunchJourney(item.journeyId);
      }
    },
  }));

  const footerActions = [
    {
      label: t('nav.topUp'),
      variant: 'primary' as const,
      onPress: () => onLaunchJourney('top-up'),
    },
    {
      label: t('nav.signIn'),
      variant: 'outline' as const,
      onPress: () => navigateToAuthScreen('/sign-in'),
    },
  ];

  return (
    <View style={styles.wrapper}>
      <AppHeaderBar
        showShadow={false}
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 10,
  },
});
