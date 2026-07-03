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
  color?: string;
  alert?: boolean;
  animate?: boolean;
  delay?: number;
  replayOnFocus?: boolean;
};

export function ProgressRing({
  percent,
  size = 100,
  strokeWidth = 10,
  label,
  sublabel,
  color = colors.primary,
  alert,
  animate = true,
  delay = 0,
  replayOnFocus = false,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const ringColor = alert && clamped >= 75 ? (clamped >= 90 ? colors.red : colors.warning) : color;

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
    <Animated.View style={[{ alignItems: 'center' }, containerStyle]}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} style={{ position: 'absolute' }}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.grayMid}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={ringColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeLinecap="round"
              animatedProps={animatedRingProps}
            />
          </G>
        </Svg>
        <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: colors.text }}>{displayPercent}%</Text>
      </View>
      <Animated.View style={[{ alignItems: 'center' }, labelStyle]}>
        <Text style={{ fontFamily: fonts.bold, marginTop: 8, color: colors.text }}>{label}</Text>
        {sublabel ? (
          <Text style={{ color: colors.textMuted, fontSize: 16, fontFamily: fonts.regular }}>{sublabel}</Text>
        ) : null}
      </Animated.View>
    </Animated.View>
  );
}
