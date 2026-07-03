import { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { Menu, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatrLogo } from '@/components/ui/ChatrLogo';
import { colors, spacing, radius } from '@/lib/theme/colors';
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

type MarketingHeaderProps = {
  onLaunchJourney: (journeyId: string) => void;
};

export function MarketingHeader({ onLaunchJourney }: MarketingHeaderProps) {
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (journeyId: string) => {
    setMenuOpen(false);
    onLaunchJourney(journeyId);
  };

  return (
    <>
      <View
        style={{
          backgroundColor: colors.white,
          paddingTop: insets.top + spacing.sm,
          paddingBottom: spacing.md,
          paddingHorizontal: spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: colors.grayMid,
        }}>
        <ChatrLogo variant="dark" height={32} />
        <Pressable
          onPress={() => setMenuOpen(true)}
          accessibilityLabel="Open menu"
          style={{
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Menu color={colors.text} size={26} />
        </Pressable>
      </View>

      <Modal visible={menuOpen} animationType="slide" transparent onRequestClose={() => setMenuOpen(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(45, 38, 59, 0.5)' }}
          onPress={() => setMenuOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              marginTop: insets.top,
              marginLeft: 'auto',
              width: '82%',
              maxWidth: 320,
              height: '100%',
              backgroundColor: colors.white,
              paddingTop: spacing.lg,
              paddingHorizontal: spacing.lg,
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
              <ChatrLogo variant="dark" height={28} />
              <Pressable onPress={() => setMenuOpen(false)}>
                <X color={colors.text} size={24} />
              </Pressable>
            </View>
            <ScrollView>
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
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
