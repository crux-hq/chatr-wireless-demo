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
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CtaButton } from '@/components/ui/Button';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const PANEL_WIDTH = Math.min(Dimensions.get('window').width * 0.82, 320);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type NavigationDrawerItem = {
  label: string;
  onPress: () => void;
};

export type NavigationDrawerFooterAction = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
};

type NavigationDrawerProps = {
  items: NavigationDrawerItem[];
  footerActions?: NavigationDrawerFooterAction[];
  footerSecondaryLink?: { prefix: string; label: string; onPress: () => void };
  visible: boolean;
  onClose: () => void;
};

export function NavigationDrawer({
  items,
  footerActions = [],
  footerSecondaryLink,
  visible,
  onClose,
}: NavigationDrawerProps) {
  const insets = useSafeAreaInsets();
  const [renderMenu, setRenderMenu] = useState(false);
  const translateX = useSharedValue(PANEL_WIDTH);
  const backdropOpacity = useSharedValue(0);
  const panelOpacity = useSharedValue(1);

  useEffect(() => {
    if (visible && !renderMenu) {
      setRenderMenu(true);
      return;
    }

    if (visible && renderMenu) {
      panelOpacity.value = 1;
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

    if (!visible && renderMenu) {
      backdropOpacity.value = withTiming(0, { duration: 220 });
      panelOpacity.value = withTiming(
        0,
        { duration: 260, easing: Easing.inOut(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(setRenderMenu)(false);
        },
      );
    }
  }, [visible, renderMenu, backdropOpacity, panelOpacity, translateX]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: panelOpacity.value,
  }));

  if (!renderMenu) return null;

  return (
    <Modal visible={renderMenu} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <AnimatedPressable
          style={[styles.backdrop, backdropStyle]}
          onPress={onClose}
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
          <View style={styles.panelHeader}>
            <Pressable onPress={onClose} accessibilityLabel="Close menu" style={{ marginLeft: 'auto' }}>
              <X color={colors.white} size={24} />
            </Pressable>
          </View>
          <View style={styles.panelBody}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.menuList}>
              {items.map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => {
                    onClose();
                    item.onPress();
                  }}
                  style={styles.menuItem}>
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
            {footerActions.length > 0 ? (
              <View style={[styles.footerActions, { paddingBottom: insets.bottom + spacing.md }]}>
                {footerActions.map((action) => (
                  <CtaButton
                    key={action.label}
                    title={action.label}
                    variant={action.variant ?? 'primary'}
                    style={{ width: '100%' }}
                    onPress={() => {
                      onClose();
                      action.onPress();
                    }}
                  />
                ))}
                {footerSecondaryLink ? (
                  <Text style={styles.footerSecondaryText}>
                    {footerSecondaryLink.prefix}
                    <Text
                      onPress={() => {
                        onClose();
                        footerSecondaryLink.onPress();
                      }}
                      style={styles.footerSecondaryLink}>
                      {footerSecondaryLink.label}
                    </Text>
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(45, 38, 59, 0.5)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.primaryCharcoal,
    shadowOffset: { width: -6, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 16,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  panelBody: {
    flex: 1,
  },
  menuList: {
    paddingBottom: spacing.md,
  },
  footerActions: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuItemText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.white,
  },
  footerSecondaryText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.lavenderMid,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  footerSecondaryLink: {
    fontFamily: fonts.semiBold,
    color: colors.accent,
    textDecorationLine: 'underline',
  },
});
