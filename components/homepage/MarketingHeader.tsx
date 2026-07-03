import { useEffect, useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView, Dimensions, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Menu, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatrLogoLink } from '@/components/ui/ChatrLogo';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const MENU_ITEMS = [
  { label: 'Plans', journeyId: 'browse-plans' },
  { label: 'Activate SIM', journeyId: 'activate' },
  { label: 'Top up', journeyId: 'top-up' },
  { label: 'Coverage', journeyId: 'coverage' },
  { label: 'Store locator', journeyId: 'stores' },
  { label: 'Support & FAQ', journeyId: 'support' },
  { label: 'Sign in', journeyId: 'sign-in' },
  { label: 'Create account', journeyId: 'register' },
] as const;

const PANEL_WIDTH = Math.min(Dimensions.get('window').width * 0.82, 320);
const HEADER_HEIGHT = 72;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type MarketingHeaderProps = {
  onLaunchJourney: (journeyId: string) => void;
};

export function MarketingHeader({ onLaunchJourney }: MarketingHeaderProps) {
  const insets = useSafeAreaInsets();
  const [renderMenu, setRenderMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const translateX = useSharedValue(PANEL_WIDTH);
  const backdropOpacity = useSharedValue(0);

  const openMenu = () => {
    setRenderMenu(true);
    setMenuOpen(true);
  };

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (menuOpen && renderMenu) {
      translateX.value = PANEL_WIDTH;
      backdropOpacity.value = 0;
      backdropOpacity.value = withTiming(1, { duration: 280 });
      translateX.value = withSpring(0, {
        damping: 26,
        stiffness: 260,
        mass: 0.9,
      });
      return;
    }

    if (!menuOpen && renderMenu) {
      backdropOpacity.value = withTiming(0, { duration: 220 });
      translateX.value = withTiming(
        PANEL_WIDTH,
        { duration: 260, easing: Easing.inOut(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(setRenderMenu)(false);
        }
      );
    }
  }, [menuOpen, renderMenu, backdropOpacity, translateX]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleNav = (journeyId: string) => {
    closeMenu();
    onLaunchJourney(journeyId);
  };

  return (
    <>
      <View
        style={{
          backgroundColor: colors.white,
          height: insets.top + HEADER_HEIGHT,
          paddingTop: insets.top,
          paddingHorizontal: spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <ChatrLogoLink />
        <Pressable
          onPress={openMenu}
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

      <Modal visible={renderMenu} transparent animationType="none" onRequestClose={closeMenu}>
        <View style={styles.overlay}>
          <AnimatedPressable
            style={[styles.backdrop, backdropStyle]}
            onPress={closeMenu}
            accessibilityLabel="Close menu"
          />
          <Animated.View
            style={[
              styles.panel,
              {
                width: PANEL_WIDTH,
                paddingTop: insets.top + spacing.lg,
              },
              panelStyle,
            ]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
              <ChatrLogoLink onNavigate={closeMenu} />
              <Pressable onPress={closeMenu} accessibilityLabel="Close menu">
                <X color={colors.primary} size={24} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {MENU_ITEMS.map((item) => (
                <Pressable
                  key={item.journeyId}
                  onPress={() => handleNav(item.journeyId)}
                  style={{
                    paddingVertical: spacing.md,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.grayMid,
                  }}>
                  <Text style={{ fontFamily: fonts.semiBold, fontSize: 16, color: colors.text }}>{item.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(45, 38, 59, 0.5)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.primaryCharcoal,
    shadowOffset: { width: -6, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 16,
  },
});
