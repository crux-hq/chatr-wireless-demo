import { View, Image, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/lib/theme/colors';

const POSTER_SOURCE = require('@/assets/images/auth/connecting-phone-poster.jpg');

type ConnectingLifestyleHeroProps = {
  style?: StyleProp<ViewStyle>;
};

/** Native fallback — static lifestyle still (video plays on web). */
export function ConnectingLifestyleHero({ style }: ConnectingLifestyleHeroProps) {
  return (
    <View
      style={[styles.wrap, style]}
      accessibilityRole="image"
      accessibilityLabel="People connecting by phone"
      pointerEvents="none">
      <Image source={POSTER_SOURCE} style={styles.poster} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.primaryCharcoal,
    overflow: 'hidden',
  },
  poster: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
});
