import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useRouter, useSegments } from 'expo-router';
import { ChevronLeft, Map, Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  filterDemoJourneys,
  JOURNEY_THEME_LABELS,
  type DemoJourney,
  type JourneyAudience,
  type JourneyTheme,
} from '@/lib/demo-journeys';
import { launchJourney } from '@/lib/launch-journey';
import { isAuthJourneyId, navigateAuthJourney } from '@/lib/nav-auth';
import { DemoAppStatePanel } from '@/components/layout/DemoAppStatePanel';
import { useAppStore } from '@/lib/store';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';
import { useTranslation } from 'react-i18next';

const AUDIENCE_TAB_KEYS: { id: JourneyAudience; labelKey: string }[] = [
  { id: 'new', labelKey: 'demo.audienceNew' },
  { id: 'existing', labelKey: 'demo.audienceExisting' },
];

function AudienceTabs({
  active,
  onChange,
}: {
  active: JourneyAudience;
  onChange: (audience: JourneyAudience) => void;
}) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.lavender,
        borderRadius: radius.pill,
        padding: 4,
        marginTop: spacing.md,
      }}>
      {AUDIENCE_TAB_KEYS.map((tab) => {
        const selected = active === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            style={{
              flex: 1,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.sm,
              borderRadius: radius.pill,
              backgroundColor: selected ? colors.primary : 'transparent',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: 14,
                color: selected ? colors.white : colors.primary,
              }}>
              {t(tab.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const SHEET_HEIGHT_RATIO = 2 / 3;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PanelMode = 'journeys' | 'state';

function JourneyThemeBadges({ themes }: { themes: JourneyTheme[] }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.sm }}>
      {themes.map((theme) => (
        <View
          key={theme}
          style={{
            backgroundColor: colors.primary + '18',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: radius.pill,
          }}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: colors.primary }}>
            {JOURNEY_THEME_LABELS[theme]}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function JourneyFab() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const segments = useSegments();
  const onTabs = segments[0] === '(tabs)';
  const [open, setOpen] = useState(false);
  const [renderModal, setRenderModal] = useState(false);
  const [panelMode, setPanelMode] = useState<PanelMode>('journeys');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [audience, setAudience] = useState<JourneyAudience>('existing');
  const [searchQuery, setSearchQuery] = useState('');
  const signIn = useAppStore((s) => s.signIn);
  const signOut = useAppStore((s) => s.signOut);
  const applyScenario = useAppStore((s) => s.applyScenario);
  const resetDemoState = useAppStore((s) => s.resetDemoState);

  const filteredJourneys = useMemo(
    () => filterDemoJourneys(audience, [], searchQuery),
    [audience, searchQuery],
  );

  const handleAudienceChange = (next: JourneyAudience) => {
    setAudience(next);
  };

  const handleLaunchJourney = async (journey: DemoJourney) => {
    if (isAuthJourneyId(journey.id)) {
      navigateAuthJourney(journey.id);
      handleClose();
      return;
    }
    setLoadingId(journey.id);
    try {
      await launchJourney(journey, { signIn, signOut, applyScenario });
      handleClose();
    } finally {
      setLoadingId(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPanelMode('journeys');
    setSearchQuery('');
  };

  const handleResetState = async () => {
    setResetting(true);
    try {
      await resetDemoState();
      handleClose();
      router.replace('/home');
    } finally {
      setResetting(false);
    }
  };

  const bottomOffset = Math.max(insets.bottom, 16) + (onTabs ? 64 : 16);
  const sheetHeight = windowHeight * SHEET_HEIGHT_RATIO;
  const backdropOpacity = useSharedValue(0);
  const translateY = useSharedValue(sheetHeight);

  useEffect(() => {
    if (open && !renderModal) {
      setRenderModal(true);
      return;
    }

    if (open && renderModal) {
      translateY.value = sheetHeight;
      backdropOpacity.value = 0;
      backdropOpacity.value = withTiming(1, { duration: 280 });
      translateY.value = withSpring(0, {
        damping: 26,
        stiffness: 260,
        mass: 0.9,
      });
      return;
    }

    if (!open && renderModal) {
      backdropOpacity.value = withTiming(0, { duration: 220 });
      translateY.value = withTiming(
        sheetHeight,
        { duration: 260, easing: Easing.inOut(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(setRenderModal)(false);
        },
      );
    }
  }, [open, renderModal, sheetHeight, backdropOpacity, translateY]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

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

      <Modal visible={renderModal} animationType="none" transparent onRequestClose={handleClose}>
        <View style={styles.modalRoot}>
          <AnimatedPressable
            style={[styles.backdrop, backdropStyle]}
            onPress={handleClose}
            accessibilityLabel="Close demo journeys"
          />
          <Animated.View
            onStartShouldSetResponder={() => true}
            style={[
              styles.sheet,
              {
                height: sheetHeight,
                paddingBottom: Math.max(insets.bottom, spacing.md),
              },
              sheetStyle,
            ]}>
            <View style={{ padding: spacing.md }}>
              {panelMode === 'journeys' ? (
                <>
                  <View style={styles.searchToolbarRow}>
                    <View style={styles.searchRow}>
                      <Search color={colors.textMuted} size={20} />
                      <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder={t('demo.searchPlaceholder')}
                        placeholderTextColor={colors.textMuted}
                        style={styles.searchInput}
                        autoCorrect={false}
                        autoCapitalize="none"
                        returnKeyType="search"
                        accessibilityLabel={t('demo.searchPlaceholder')}
                      />
                    </View>
                    <Pressable
                      onPress={() => setPanelMode('state')}
                      disabled={loadingId !== null}
                      style={[styles.footerButtonCompact, { opacity: loadingId ? 0.6 : 1 }]}>
                      <Text style={styles.footerButtonText}>{t('demo.viewAppState')}</Text>
                    </Pressable>
                  </View>
                  <AudienceTabs active={audience} onChange={handleAudienceChange} />
                </>
              ) : (
                <Pressable
                  onPress={() => setPanelMode('journeys')}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}
                  accessibilityLabel={t('demo.backToJourneys')}>
                  <ChevronLeft color={colors.primary} size={22} />
                  <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: colors.text }}>
                    {t('demo.appStateTitle')}
                  </Text>
                </Pressable>
              )}
            </View>

            {panelMode === 'journeys' ? (
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: spacing.md, flexGrow: 1 }}
                keyboardShouldPersistTaps="handled">
                {filteredJourneys.length === 0 ? (
                  <View
                    style={{
                      padding: spacing.lg,
                      alignItems: 'center',
                      backgroundColor: colors.lavender,
                      borderRadius: radius.md,
                    }}>
                    <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.textMuted, textAlign: 'center' }}>
                      {searchQuery.trim()
                        ? t('demo.noSearchResults')
                        : t('demo.noJourneysAudience')}
                    </Text>
                  </View>
                ) : (
                  filteredJourneys.map((journey) => {
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
                            fontSize: 16,
                            color: colors.textMuted,
                            marginTop: 4,
                            lineHeight: 24,
                          }}>
                          {journey.description}
                        </Text>
                        <JourneyThemeBadges themes={journey.themes} />
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
                  })
                )}
              </ScrollView>
            ) : (
              <DemoAppStatePanel />
            )}

            {panelMode === 'state' ? (
              <Pressable
                onPress={() => void handleResetState()}
                disabled={resetting}
                style={{
                  marginHorizontal: spacing.md,
                  marginTop: spacing.xs,
                  padding: spacing.md,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: colors.red,
                  backgroundColor: colors.white,
                  alignItems: 'center',
                  opacity: resetting ? 0.6 : 1,
                }}>
                {resetting ? (
                  <ActivityIndicator color={colors.red} size="small" />
                ) : (
                  <Text style={{ fontFamily: fonts.semiBold, color: colors.red }}>{t('demo.resetState')}</Text>
                )}
              </Pressable>
            ) : null}
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(45, 38, 59, 0.55)',
  },
  sheet: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  searchToolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  searchRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lavender,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.grayMid,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'web' ? spacing.sm : spacing.sm + 2,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' as const } : {}),
  },
  footerButtonCompact: {
    flexShrink: 0,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  footerButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.primary,
  },
});
