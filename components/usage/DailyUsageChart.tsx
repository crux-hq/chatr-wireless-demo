import { useEffect } from 'react';
import { Dimensions, type StyleProp, type ViewStyle } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { colors } from '@/lib/theme/colors';

type DailyUsageChartProps = {
  data: { value: number; label: string; frontColor: string }[];
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

export function DailyUsageChart({ data, delay = 180, style }: DailyUsageChartProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(14);

  useEffect(() => {
    opacity.value = 0;
    translateY.value = 14;
    opacity.value = withDelay(delay, withTiming(1, { duration: 380, easing: Easing.out(Easing.cubic) }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 420, easing: Easing.out(Easing.cubic) }));
  }, [data, delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (data.length === 0) return null;

  return (
    <Animated.View style={[animatedStyle, style]}>
      <BarChart
        data={data}
        width={Dimensions.get('window').width - 80}
        height={180}
        barWidth={16}
        spacing={8}
        roundedTop
        yAxisThickness={0}
        xAxisThickness={0}
        noOfSections={4}
        maxValue={800}
        isAnimated
        animationDuration={620}
      />
    </Animated.View>
  );
}
