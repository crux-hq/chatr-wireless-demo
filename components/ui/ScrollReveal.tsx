import { useEffect, useRef } from 'react';
import { View, Dimensions, type ViewStyle, type StyleProp } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

type ScrollRevealDirection = 'up' | 'left' | 'right';

type ScrollRevealProps = {
  children: React.ReactNode;
  scrollY: number;
  delayMs?: number;
  direction?: ScrollRevealDirection;
  style?: StyleProp<ViewStyle>;
};

export function ScrollReveal({ children, scrollY, delayMs = 0, direction = 'up', style }: ScrollRevealProps) {
  const ref = useRef<View>(null);
  const progress = useSharedValue(0);
  const hasRevealed = useRef(false);
  const viewportHeight = Dimensions.get('window').height;

  const tryReveal = () => {
    if (hasRevealed.current) return;

    ref.current?.measureInWindow((_x, y, _w, height) => {
      const visibleFromBottom = viewportHeight - y;
      const revealThreshold = Math.min(Math.max(height * 0.14, 40), 72);

      if (visibleFromBottom >= revealThreshold) {
        hasRevealed.current = true;
        progress.value = withDelay(
          delayMs,
          withTiming(1, { duration: 280, easing: Easing.out(Easing.quad) }),
        );
      }
    });
  };

  useEffect(() => {
    tryReveal();
  }, [scrollY]);

  useEffect(() => {
    const timer = setTimeout(tryReveal, 80);
    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const hidden = 1 - progress.value;

    if (direction === 'left') {
      return {
        opacity: progress.value,
        transform: [{ translateX: hidden * -24 }],
      };
    }

    if (direction === 'right') {
      return {
        opacity: progress.value,
        transform: [{ translateX: hidden * 24 }],
      };
    }

    return {
      opacity: progress.value,
      transform: [{ translateY: hidden * 14 }],
    };
  });

  return (
    <View ref={ref} collapsable={false} style={style}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </View>
  );
}
