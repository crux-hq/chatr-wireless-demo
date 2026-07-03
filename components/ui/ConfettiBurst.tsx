import { useEffect, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/lib/theme/colors';

const CONFETTI_COLORS = [colors.accent, colors.primary, '#FF6B6B', '#4ECDC4', colors.white, '#FFD93D'];

type PieceConfig = {
  id: number;
  startX: number;
  delay: number;
  drift: number;
  rotation: number;
  color: string;
  size: number;
};

function ConfettiPiece({ config, height }: { config: PieceConfig; height: number }) {
  const translateY = useSharedValue(-24);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      config.delay,
      withTiming(height + 80, { duration: 2600, easing: Easing.out(Easing.quad) }),
    );
    translateX.value = withDelay(
      config.delay,
      withTiming(config.drift, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
    );
    rotate.value = withDelay(
      config.delay,
      withTiming(config.rotation, { duration: 2600, easing: Easing.linear }),
    );
    opacity.value = withDelay(config.delay + 2100, withTiming(0, { duration: 500 }));
  }, [config, height, opacity, rotate, translateX, translateY]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left: config.startX,
          width: config.size,
          height: config.size * 1.6,
          backgroundColor: config.color,
          borderRadius: config.size > 7 ? 2 : 999,
        },
        style,
      ]}
    />
  );
}

export function ConfettiBurst({ active }: { active: boolean }) {
  const { width, height } = useWindowDimensions();

  const pieces = useMemo<PieceConfig[]>(() => {
    if (!active) return [];
    return Array.from({ length: 56 }, (_, id) => ({
      id,
      startX: Math.random() * width,
      delay: Math.random() * 350,
      drift: (Math.random() - 0.5) * 220,
      rotation: Math.random() * 720,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 5 + Math.random() * 6,
    }));
  }, [active, width]);

  if (!active) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      {pieces.map((piece) => (
        <ConfettiPiece key={piece.id} config={piece} height={height} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
    overflow: 'hidden',
  },
  piece: {
    position: 'absolute',
    top: 0,
  },
});
