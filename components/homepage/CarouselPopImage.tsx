import { useEffect } from 'react';
import { Image, type ImageSourcePropType, type StyleProp, type ImageStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

type CarouselPopImageProps = {
  source: ImageSourcePropType;
  active: boolean;
  style?: StyleProp<ImageStyle>;
};

export function CarouselPopImage({ source, active, style }: CarouselPopImageProps) {
  const scale = useSharedValue(0.96);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!active) {
      scale.value = 0.96;
      opacity.value = 0;
      return;
    }

    opacity.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) });
    scale.value = withSpring(1, { damping: 14, stiffness: 200, mass: 0.65 });
  }, [active, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Image source={source} style={style} resizeMode="contain" />
    </Animated.View>
  );
}
