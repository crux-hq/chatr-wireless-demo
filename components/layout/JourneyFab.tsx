import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSegments } from 'expo-router';
import { Map } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DEMO_JOURNEYS, type DemoJourney } from '@/lib/demo-journeys';
import { launchJourney } from '@/lib/launch-journey';
import { useAppStore } from '@/lib/store';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export function JourneyFab() {
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const onTabs = segments[0] === '(tabs)';
  const [open, setOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const signIn = useAppStore((s) => s.signIn);
  const signOut = useAppStore((s) => s.signOut);
  const applyScenario = useAppStore((s) => s.applyScenario);

  const handleLaunchJourney = async (journey: DemoJourney) => {
    setLoadingId(journey.id);
    try {
      await launchJourney(journey, { signIn, signOut, applyScenario });
      setOpen(false);
    } finally {
      setLoadingId(null);
    }
  };

  const bottomOffset = Math.max(insets.bottom, 16) + (onTabs ? 64 : 16);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityLabel="Open demo journeys"
        style={{
          position: 'absolute',
          right: spacing.md,
          bottom: bottomOffset,
          width: 52,
          height: 52,
          borderRadius: radius.pill,
          backgroundColor: colors.accent,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.primaryCharcoal,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 8,
          zIndex: 9999,
        }}>
        <Map color={colors.textOnAccent} size={24} strokeWidth={2.5} />
      </Pressable>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(45, 38, 59, 0.55)', justifyContent: 'flex-end' }}
          onPress={() => setOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: colors.surfaceElevated,
              borderTopLeftRadius: radius.lg,
              borderTopRightRadius: radius.lg,
              maxHeight: '85%',
              paddingBottom: Math.max(insets.bottom, spacing.md),
            }}>
            <View
              style={{
                paddingHorizontal: spacing.lg,
                paddingTop: spacing.lg,
                paddingBottom: spacing.sm,
                borderBottomWidth: 1,
                borderBottomColor: colors.grayMid,
              }}>
              <Text style={{ fontFamily: fonts.extraBold, fontSize: 20, color: colors.text }}>
                Demo journeys
              </Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, marginTop: 4 }}>
                Tap a journey to sign in and go there instantly.
              </Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: spacing.md }} keyboardShouldPersistTaps="handled">
              {DEMO_JOURNEYS.map((journey) => {
                const isLoading = loadingId === journey.id;
                return (
                  <Pressable
                    key={journey.id}
                    onPress={() => void handleLaunchJourney(journey)}
                    disabled={loadingId !== null}
                    style={{
                      backgroundColor: colors.lavender,
                      borderRadius: radius.md,
                      padding: spacing.md,
                      marginBottom: spacing.sm,
                      borderWidth: 1,
                      borderColor: colors.grayMid,
                      opacity: loadingId && !isLoading ? 0.5 : 1,
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.text, flex: 1 }}>
                        {journey.title}
                      </Text>
                      {isLoading ? <ActivityIndicator color={colors.primary} size="small" /> : null}
                    </View>
                    <Text
                      style={{
                        fontFamily: fonts.regular,
                        fontSize: 13,
                        color: colors.textMuted,
                        marginTop: 4,
                        lineHeight: 18,
                      }}>
                      {journey.description}
                    </Text>
                    {(journey.email || journey.password) && (
                      <View
                        style={{
                          marginTop: spacing.sm,
                          backgroundColor: colors.surfaceElevated,
                          borderRadius: radius.sm,
                          padding: spacing.sm,
                        }}>
                        {journey.email ? (
                          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.primary }}>
                            Email: {journey.email}
                          </Text>
                        ) : null}
                        {journey.password ? (
                          <Text
                            style={{
                              fontFamily: fonts.medium,
                              fontSize: 12,
                              color: colors.textMuted,
                              marginTop: journey.email ? 2 : 0,
                            }}>
                            Password: {journey.password}
                          </Text>
                        ) : null}
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable
              onPress={() => setOpen(false)}
              style={{ padding: spacing.md, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.semiBold, color: colors.textMuted }}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
