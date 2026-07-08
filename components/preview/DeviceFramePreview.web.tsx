import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Wifi, SignalHigh, BatteryFull, Home, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';
import { PREVIEW_JOURNEYS, type PreviewJourney } from '@/lib/preview-journeys';
import {
  CAMERA_HEIGHT,
  CAMERA_LAYOUT,
  CAMERA_SOURCE,
  CAMERA_WIDTH,
  DEVICE_HEIGHT,
  DEVICE_VIEWPORT_WIDTH,
  DEVICE_WIDTH,
  IFRAME_SCALE,
  IFRAME_VIEWPORT_HEIGHT,
  IPHONE_FRAME_SOURCE,
  SCREEN_LAYOUT,
  STATUS_BAR_HEIGHT,
  getPreviewIframeSrc,
  queuePreviewBootstrap,
} from '@/lib/preview-frame';

const HIDE_SCROLLBAR_CSS = `
  ::-webkit-scrollbar { display: none; width: 0; height: 0; }
  * { scrollbar-width: none; -ms-overflow-style: none; }
`;

const PANEL_WIDTH = 320;

function PreviewIframe({ src }: { src: string }) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container) return;

    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = 'My chatr app preview';
    iframe.setAttribute('allow', 'geolocation');
    // Render at the real device's logical viewport (430px) and scale down to fit
    // the frame, so element sizes match a physical iPhone.
    iframe.style.cssText = [
      'position:absolute',
      'top:0',
      'left:0',
      `width:${DEVICE_VIEWPORT_WIDTH}px`,
      `height:${IFRAME_VIEWPORT_HEIGHT}px`,
      `transform:scale(${IFRAME_SCALE})`,
      'transform-origin:top left',
      'border:0',
      'margin:0',
      'padding:0',
      'background:#fff',
    ].join(';');

    const hideScrollbars = () => {
      const doc = iframe.contentDocument;
      if (!doc?.head) return;
      const style = doc.createElement('style');
      style.textContent = HIDE_SCROLLBAR_CSS;
      doc.head.appendChild(style);
    };

    iframe.addEventListener('load', hideScrollbars);
    container.appendChild(iframe);

    return () => {
      iframe.removeEventListener('load', hideScrollbars);
      iframe.remove();
    };
  }, [container, src]);

  return (
    <View
      // @ts-expect-error — web-only ref to mount a DOM iframe
      ref={setContainer}
      style={StyleSheet.absoluteFill}
    />
  );
}

function StatusBar() {
  return (
    <View style={styles.statusBar}>
      <Text style={styles.statusBarTime}>9:41</Text>
      <View style={styles.statusBarIcons}>
        <SignalHigh color={colors.text} size={16} strokeWidth={2.5} />
        <Wifi color={colors.text} size={16} strokeWidth={2.5} />
        <BatteryFull color={colors.text} size={18} strokeWidth={2} />
      </View>
    </View>
  );
}

type WalkthroughState = {
  journey: PreviewJourney;
  stepIndex: number;
  /** Bumped on every journey start so the iframe reloads with fresh app state. */
  session: number;
};

function JourneyMenu({ onSelect }: { onSelect: (journey: PreviewJourney) => void }) {
  return (
    <View>
      <Text style={styles.overline}>Interactive walkthrough</Text>
      <Text style={styles.heading}>chatr app</Text>
      <Text style={styles.subheading}>
        A prepaid self-serve experience for Canada. Pick a journey to walk through it on the
        device.
      </Text>
      <View style={styles.menuList}>
        {PREVIEW_JOURNEYS.map((journey) => (
          <Pressable key={journey.id} onPress={() => onSelect(journey)}>
            {({ hovered }) => (
              <View style={styles.menuItem}>
                <Text style={[styles.menuItemText, hovered && styles.menuItemTextHovered]}>
                  {journey.title}
                </Text>
                <ArrowRight
                  color={hovered ? colors.primary : colors.grayMid}
                  size={16}
                  strokeWidth={2}
                />
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function JourneyStep({
  walkthrough,
  onProceed,
  onBack,
  onHome,
}: {
  walkthrough: WalkthroughState;
  onProceed: () => void;
  onBack: () => void;
  onHome: () => void;
}) {
  const { journey, stepIndex } = walkthrough;
  const step = journey.steps[stepIndex];
  const isLastStep = stepIndex === journey.steps.length - 1;

  return (
    <View>
      <View style={styles.stepHeader}>
        <Text style={styles.overline}>{journey.title}</Text>
        <Pressable onPress={onHome} accessibilityLabel="Back to all journeys" hitSlop={8}>
          {({ hovered }) => (
            <Home color={hovered ? colors.primary : colors.textMuted} size={18} strokeWidth={2} />
          )}
        </Pressable>
      </View>

      <Text style={styles.stepCounter}>
        Step {stepIndex + 1} of {journey.steps.length}
      </Text>
      <Text style={styles.stepTitle}>{step.title}</Text>
      <Text style={styles.stepHighlight}>{step.highlight}</Text>

      <View style={styles.stepActions}>
        <Pressable onPress={onProceed}>
          {({ hovered }) => (
            <View style={styles.stepLink}>
              <Text style={[styles.stepLinkText, hovered && styles.stepLinkTextHovered]}>
                {isLastStep ? 'Back to all journeys' : 'Continue'}
              </Text>
              <ArrowRight
                color={hovered ? colors.primaryDark : colors.primary}
                size={16}
                strokeWidth={2.25}
              />
            </View>
          )}
        </Pressable>

        {stepIndex > 0 && (
          <Pressable onPress={onBack}>
            {({ hovered }) => (
              <View style={styles.stepLink}>
                <ArrowLeft
                  color={hovered ? colors.text : colors.textMuted}
                  size={15}
                  strokeWidth={2}
                />
                <Text style={[styles.stepBackText, hovered && styles.stepBackTextHovered]}>
                  Back
                </Text>
              </View>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}

export function DeviceFramePreview() {
  const { path } = useLocalSearchParams<{ path?: string }>();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const [walkthrough, setWalkthrough] = useState<WalkthroughState | null>(null);

  const defaultSrc = useMemo(() => getPreviewIframeSrc(path), [path]);
  const iframeSrc = walkthrough ? walkthrough.journey.steps[walkthrough.stepIndex].route : defaultSrc;
  const iframeKey = walkthrough ? `journey-${walkthrough.session}-${iframeSrc}` : `default-${iframeSrc}`;

  const startJourney = useCallback((journey: PreviewJourney) => {
    // Apply scenario/sign-out inside the iframe only — mutating the parent store
    // flips AuthGate isLoading and unmounts /preview (looks like a redirect to /).
    queuePreviewBootstrap({
      scenarioId: journey.scenarioId,
      signOutFirst: journey.signOutFirst,
    });
    setWalkthrough((prev) => ({ journey, stepIndex: 0, session: (prev?.session ?? 0) + 1 }));
  }, []);

  const handleProceed = useCallback(() => {
    setWalkthrough((prev) => {
      if (!prev) return prev;
      if (prev.stepIndex >= prev.journey.steps.length - 1) return null;
      return { ...prev, stepIndex: prev.stepIndex + 1 };
    });
  }, []);

  const handleBack = useCallback(() => {
    setWalkthrough((prev) =>
      prev && prev.stepIndex > 0 ? { ...prev, stepIndex: prev.stepIndex - 1 } : prev,
    );
  }, []);

  const handleHome = useCallback(() => setWalkthrough(null), []);

  const stacked = windowWidth < 980;

  return (
    <View style={[styles.stage, { minHeight: windowHeight }]}>
      <LinearGradient
        colors={['#F6F2FF', '#FDFCFA', '#FFF9EC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.stageInner, stacked && styles.stageInnerStacked]}>
        <View style={[styles.panel, stacked && styles.panelStacked]}>
          {walkthrough ? (
            <JourneyStep
              walkthrough={walkthrough}
              onProceed={handleProceed}
              onBack={handleBack}
              onHome={handleHome}
            />
          ) : (
            <JourneyMenu onSelect={startJourney} />
          )}
        </View>

        <View style={[styles.device, { width: DEVICE_WIDTH, height: DEVICE_HEIGHT }]}>
          <Image
            source={IPHONE_FRAME_SOURCE}
            style={[styles.frame, { width: DEVICE_WIDTH, height: DEVICE_HEIGHT }]}
            resizeMode="stretch"
            accessibilityIgnoresInvertColors
            importantForAccessibility="no-hide-descendants"
          />

          <View
            style={[
              styles.screen,
              {
                left: SCREEN_LAYOUT.left,
                top: SCREEN_LAYOUT.top,
                width: SCREEN_LAYOUT.width,
                height: SCREEN_LAYOUT.height,
                borderRadius: SCREEN_LAYOUT.width * 0.13,
              },
            ]}>
            <StatusBar />
            <View style={styles.appArea}>
              <PreviewIframe key={iframeKey} src={iframeSrc} />
            </View>
          </View>

          <Image
            source={CAMERA_SOURCE}
            style={[
              styles.camera,
              {
                left: CAMERA_LAYOUT.left,
                top: CAMERA_LAYOUT.top,
                width: CAMERA_WIDTH,
                height: CAMERA_HEIGHT,
              },
            ]}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
            importantForAccessibility="no-hide-descendants"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>by Tech Mahindra</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    width: '100%',
  },
  stageInner: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 72,
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  stageInnerStacked: {
    flexDirection: 'column',
    gap: 40,
  },
  panel: {
    width: PANEL_WIDTH,
  },
  panelStacked: {
    width: '100%',
    maxWidth: 420,
  },
  overline: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.primaryLight,
  },
  heading: {
    fontFamily: fonts.bold,
    fontSize: 40,
    lineHeight: 48,
    color: colors.text,
    marginTop: spacing.sm,
  },
  subheading: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textMuted,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  menuList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(84, 46, 145, 0.12)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(84, 46, 145, 0.12)',
  },
  menuItemText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
  menuItemTextHovered: {
    color: colors.primary,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  stepCounter: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  stepTitle: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 36,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  stepHighlight: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 23,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  stepActions: {
    gap: spacing.md,
  },
  stepLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  stepLinkText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.primary,
  },
  stepLinkTextHovered: {
    color: colors.primaryDark,
  },
  stepBackText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
  },
  stepBackTextHovered: {
    color: colors.text,
  },
  device: {
    position: 'relative',
    flexShrink: 0,
  },
  frame: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  screen: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 2,
    backgroundColor: colors.white,
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingBottom: 6,
  },
  statusBarTime: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.text,
  },
  statusBarIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  appArea: {
    flex: 1,
    position: 'relative',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 18,
  },
  footerText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    letterSpacing: 0.5,
    color: 'rgba(107, 98, 128, 0.65)',
  },
  camera: {
    position: 'absolute',
    zIndex: 3,
    pointerEvents: 'none',
  },
});
