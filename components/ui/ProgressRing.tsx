import { useCallback, useEffect, useState } from 'react';
import Svg, { Circle, G } from 'react-native-svg';
import { View, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ProgressRingProps = {
  percent: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  sublabel?: string;
  detailSublabel?: string;
  color?: string;
  alert?: boolean;
  animate?: boolean;
  delay?: number;
  replayOnFocus?: boolean;
  unlimited?: boolean;
  compact?: boolean;
};

export function ProgressRing({
  percent,
  size,
  strokeWidth = 10,
  label,
  sublabel,
  detailSublabel,
  color = colors.primary,
  alert,
  animate = true,
  delay = 0,
  replayOnFocus = false,
  unlimited = false,
  compact = false,
}: ProgressRingProps) {
  const ringSize = size ?? (compact ? 88 : 100);
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = unlimited ? 0 : Math.min(100, Math.max(0, percent));
  const ringColor = alert && clamped >= 75 ? (clamped >= 90 ? colors.red : colors.warning) : color;
  const labelFontSize = compact ? 14 : 16;
  const sublabelFontSize = compact ? 13 : 16;
  const sublabelLineHeight = compact ? 18 : 22;

  const progress = useSharedValue(animate ? 0 : clamped);
  const opacity = useSharedValue(animate ? 0 : 1);
  const scale = useSharedValue(animate ? 0.94 : 1);
  const [displayPercent, setDisplayPercent] = useState(animate ? 0 : clamped);
  const [focusTick, setFocusTick] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (replayOnFocus && animate) {
        setFocusTick((tick) => tick + 1);
      }
    }, [animate, replayOnFocus]),
  );

  useEffect(() => {
    if (!animate) {
      progress.value = clamped;
      opacity.value = 1;
      scale.value = 1;
      setDisplayPercent(clamped);
      return;
    }

    progress.value = 0;
    opacity.value = 0;
    scale.value = 0.94;
    setDisplayPercent(0);

    opacity.value = withDelay(delay, withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) }));
    scale.value = withDelay(delay, withTiming(1, { duration: 340, easing: Easing.out(Easing.cubic) }));
    progress.value = withDelay(
      delay + 60,
      withTiming(clamped, { duration: 650, easing: Easing.out(Easing.cubic) }),
    );

    let mounted = true;
    let raf = 0;
    const startTimeout = setTimeout(() => {
      const start = performance.now();
      const duration = 650;
      const tick = (now: number) => {
        if (!mounted) return;
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - t) ** 3;
        setDisplayPercent(Math.round(clamped * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay + 60);

    return () => {
      mounted = false;
      clearTimeout(startTimeout);
      cancelAnimationFrame(raf);
    };
  }, [animate, clamped, delay, focusTick, opacity, progress, scale]);

  const animatedRingProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (progress.value / 100) * circumference,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[{ alignItems: 'center', flex: compact ? 1 : undefined }, containerStyle]}>
      <View style={{ width: ringSize, height: ringSize, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={ringSize} height={ringSize} style={{ position: 'absolute' }}>
          <Circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            stroke={colors.grayMid}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <G transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}>
            {!unlimited ? (
              <AnimatedCircle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                stroke={ringColor}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeLinecap="round"
                animatedProps={animatedRingProps}
              />
            ) : null}
          </G>
        </Svg>
        <Text
          style={{
            fontFamily: fonts.bold,
            fontSize: unlimited ? (compact ? 24 : 28) : compact ? 18 : 20,
            color: colors.text,
          }}>
          {unlimited ? '∞' : `${displayPercent}%`}
        </Text>
      </View>
      <Animated.View
        style={[
          { alignItems: 'center', maxWidth: compact ? ringSize + 36 : undefined, paddingHorizontal: compact ? 4 : 0 },
          labelStyle,
        ]}>
        <Text style={{ fontFamily: fonts.bold, marginTop: 8, fontSize: labelFontSize, color: colors.text }}>
          {label}
        </Text>
        {sublabel ? (
          <Text
            style={{
              color: colors.textMuted,
              fontSize: sublabelFontSize,
              lineHeight: sublabelLineHeight,
              fontFamily: fonts.regular,
              textAlign: 'center',
              marginTop: compact ? 2 : 0,
            }}>
            {sublabel}
          </Text>
        ) : null}
        {detailSublabel ? (
          <Text
            style={{
              color: colors.textMuted,
              fontSize: sublabelFontSize,
              lineHeight: sublabelLineHeight,
              fontFamily: fonts.regular,
              marginTop: 4,
              textAlign: 'center',
            }}>
            {detailSublabel}
          </Text>
        ) : null}
      </Animated.View>
    </Animated.View>
  );
}
