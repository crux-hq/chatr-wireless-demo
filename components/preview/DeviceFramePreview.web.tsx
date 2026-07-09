import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { View, Text, Image, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
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
  postPreviewNavigate,
  queuePreviewBootstrap,
  withPreviewEmbed,
} from '@/lib/preview-frame';

type TransitionDirection = 'forward' | 'back';

const PANEL_TRANSITION_MS = 320;
const PANEL_SLIDE_PX = 28;
const easeOut = Easing.out(Easing.cubic);

function AnimatedPanel({
  direction,
  children,
}: {
  direction: TransitionDirection;
  children: ReactNode;
}) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(direction === 'forward' ? PANEL_SLIDE_PX : -PANEL_SLIDE_PX);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: PANEL_TRANSITION_MS, easing: easeOut });
    translateX.value = withTiming(0, { duration: PANEL_TRANSITION_MS, easing: easeOut });
  }, [opacity, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

const HIDE_SCROLLBAR_CSS = `
  ::-webkit-scrollbar { display: none; width: 0; height: 0; }
  * { scrollbar-width: none; -ms-overflow-style: none; }
`;

const PANEL_WIDTH = 320;

function PreviewIframe({ src, remountKey }: { src: string; remountKey: string }) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const appliedSrcRef = useRef<string | null>(null);
  const readyRef = useRef(false);
  const srcRef = useRef(src);
  srcRef.current = src;

  useEffect(() => {
    if (!container) return;

    readyRef.current = false;
    const iframe = document.createElement('iframe');
    iframe.src = srcRef.current;
    appliedSrcRef.current = srcRef.current;
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

    const onLoad = () => {
      readyRef.current = true;
      const doc = iframe.contentDocument;
      if (doc?.head) {
        const style = doc.createElement('style');
        style.textContent = HIDE_SCROLLBAR_CSS;
        doc.head.appendChild(style);
      }
      // Always soft-navigate after load so bootstrap auth finishes before routing.
      if (iframe.contentWindow) {
        appliedSrcRef.current = srcRef.current;
        postPreviewNavigate(iframe.contentWindow, srcRef.current);
      }
    };

    iframe.addEventListener('load', onLoad);
    iframeRef.current = iframe;
    container.appendChild(iframe);

    return () => {
      iframe.removeEventListener('load', onLoad);
      iframe.remove();
      iframeRef.current = null;
      appliedSrcRef.current = null;
      readyRef.current = false;
    };
  }, [container, remountKey]);

  useEffect(() => {
    const iframe = iframeRef.current;
    const win = iframe?.contentWindow;
    if (!iframe || !win || appliedSrcRef.current === src) return;
    if (!readyRef.current) {
      // Keep desired src; onLoad will soft-navigate once the bridge is up.
      return;
    }
    appliedSrcRef.current = src;
    postPreviewNavigate(win, src);
  }, [src]);

  return (
    <View
      // @ts-expect-error — web-only ref to mount a DOM iframe
      ref={setContainer}
      style={StyleSheet.absoluteFill}
    />
  );
}

function formatLocalStatusBarTime(date = new Date()) {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function StatusBar() {
  const [time, setTime] = useState(formatLocalStatusBarTime);

  useEffect(() => {
    const tick = () => setTime(formatLocalStatusBarTime());
    tick();

    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      tick();
      intervalId = setInterval(tick, 60_000);
    }, msUntilNextMinute);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <View style={styles.statusBar}>
      <Text style={styles.statusBarTime}>{time}</Text>
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
        Pick a journey to walk through it on the device.
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
  const [direction, setDirection] = useState<TransitionDirection>('forward');

  const defaultSrc = useMemo(() => getPreviewIframeSrc(path), [path]);
  const iframeSrc = useMemo(() => {
    const route = walkthrough ? walkthrough.journey.steps[walkthrough.stepIndex].route : defaultSrc;
    return withPreviewEmbed(route);
  }, [walkthrough, defaultSrc]);
  // Remount only when starting a journey (fresh bootstrap). Step changes navigate
  // the existing iframe so AuthGate hydrate cannot drop the deep link.
  const iframeRemountKey = walkthrough ? `journey-${walkthrough.session}` : `default-${defaultSrc}`;
  const panelKey = walkthrough
    ? `${walkthrough.journey.id}-${walkthrough.stepIndex}-${walkthrough.session}`
    : 'menu';

  const startJourney = useCallback((journey: PreviewJourney) => {
    // Apply scenario/sign-out inside the iframe only — mutating the parent store
    // flips AuthGate isLoading and unmounts /preview (looks like a redirect to /).
    queuePreviewBootstrap({
      scenarioId: journey.scenarioId,
      signOutFirst: journey.signOutFirst,
    });
    setDirection('forward');
    setWalkthrough((prev) => ({ journey, stepIndex: 0, session: (prev?.session ?? 0) + 1 }));
  }, []);

  const handleProceed = useCallback(() => {
    if (!walkthrough) return;
    if (walkthrough.stepIndex >= walkthrough.journey.steps.length - 1) {
      setDirection('back');
      setWalkthrough(null);
      return;
    }
    setDirection('forward');
    setWalkthrough({ ...walkthrough, stepIndex: walkthrough.stepIndex + 1 });
  }, [walkthrough]);

  const handleBack = useCallback(() => {
    if (!walkthrough || walkthrough.stepIndex <= 0) return;
    setDirection('back');
    setWalkthrough({ ...walkthrough, stepIndex: walkthrough.stepIndex - 1 });
  }, [walkthrough]);

  const handleHome = useCallback(() => {
    setDirection('back');
    setWalkthrough(null);
  }, []);

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
          <AnimatedPanel key={panelKey} direction={direction}>
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
          </AnimatedPanel>
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
              <PreviewIframe remountKey={iframeRemountKey} src={iframeSrc} />
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
