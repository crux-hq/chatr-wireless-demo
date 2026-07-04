import { useEffect, useRef } from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { colors, spacing, radius } from '@/lib/theme/colors';

type WhyChatrImageBannerProps = {
  scrollY: number;
};

function getScrollProgress(y: number, height: number) {
  const viewportHeight = Dimensions.get('window').height;
  const startY = viewportHeight * 0.96;
  const endY = viewportHeight * 0.68;
  const focusY = y + height * 0.35;
  return Math.max(0, Math.min(1, (startY - focusY) / (startY - endY)));
}

export function WhyChatrImageBanner({ scrollY }: WhyChatrImageBannerProps) {
  const containerRef = useRef<View>(null);
  const progress = useSharedValue(0);
  const rafRef = useRef<number | null>(null);

  const updateProgress = () => {
    containerRef.current?.measureInWindow((_x, y, _width, height) => {
      progress.value = getScrollProgress(y, height);
    });
  };

  useEffect(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [scrollY]);

  useEffect(() => {
    const timer = setTimeout(updateProgress, 0);
    return () => clearTimeout(timer);
  }, []);

  const gradientShiftStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.65]),
    backgroundColor: interpolateColor(progress.value, [0, 1], ['rgba(84, 46, 145, 0)', 'rgba(84, 46, 145, 0.38)']),
  }));

  const accentOrbStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.6, 1], [0, 0.45, 0.75]),
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [-28, 18]) },
      { translateY: interpolate(progress.value, [0, 1], [20, -8]) },
      { scale: interpolate(progress.value, [0, 1], [0.82, 1.05]) },
    ],
  }));

  const lavenderOrbStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.4]),
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [36, -16]) },
      { translateY: interpolate(progress.value, [0, 1], [-8, 14]) },
      { scale: interpolate(progress.value, [0, 1], [0.78, 1]) },
    ],
  }));

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [6, 4]) }],
  }));

  return (
    <View
      ref={containerRef}
      collapsable={false}
      onLayout={updateProgress}
      style={{
        width: '100%',
        marginTop: spacing.lg,
        borderRadius: radius.lg,
        overflow: 'hidden',
      }}>
      <LinearGradient
        colors={['rgba(222, 201, 255, 0.2)', 'rgba(222, 201, 255, 0.5)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ paddingTop: 10, position: 'relative' }}>
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFillObject, gradientShiftStyle]} />
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: -36,
              right: -28,
              width: 180,
              height: 180,
              borderRadius: 90,
              backgroundColor: colors.accent,
            },
            accentOrbStyle,
          ]}
        />
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              bottom: -48,
              left: -24,
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: colors.lavenderMid,
            },
            lavenderOrbStyle,
          ]}
        />
        <Animated.View style={imageStyle}>
          <Image
            source={require('@/assets/images/homepage/why-chatr-person.png')}
            style={{
              width: '100%',
              height: 320,
              resizeMode: 'contain',
            }}
          />
        </Animated.View>
      </LinearGradient>
    </View>
  );
}
