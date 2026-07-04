import { useEffect, useMemo, useState } from 'react';
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

type DailyUsageChartProps = {
  data: { value: number; label: string; frontColor: string }[];
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

const CHART_HEIGHT = 180;
const Y_AXIS_WIDTH = 44;
const END_PADDING = 8;

function fitBarLayout(barCount: number, chartWidth: number) {
  if (barCount === 0 || chartWidth <= 0) {
    return { barWidth: 12, spacing: 6, initialSpacing: 6 };
  }

  const available = chartWidth - END_PADDING * 2;
  const spacingRatio = 0.5;
  const barWidth = Math.max(
    8,
    Math.floor(available / (barCount + spacingRatio * (barCount - 1))),
  );
  const spacing = Math.max(4, Math.round(barWidth * spacingRatio));

  return { barWidth, spacing, initialSpacing: spacing };
}

export function DailyUsageChart({ data, delay = 180, style }: DailyUsageChartProps) {
  const [containerWidth, setContainerWidth] = useState(0);
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

  const chartWidth = Math.max(0, containerWidth - Y_AXIS_WIDTH);
  const { barWidth, spacing, initialSpacing } = useMemo(
    () => fitBarLayout(data.length, chartWidth),
    [data.length, chartWidth],
  );

  const onLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    if (nextWidth !== containerWidth) {
      setContainerWidth(nextWidth);
    }
  };

  if (data.length === 0) return null;

  return (
    <View style={{ width: '100%' }} onLayout={onLayout}>
      {containerWidth > 0 ? (
        <Animated.View style={[animatedStyle, style]}>
          <BarChart
            data={data}
            parentWidth={containerWidth}
            width={chartWidth}
            height={CHART_HEIGHT}
            barWidth={barWidth}
            spacing={spacing}
            initialSpacing={initialSpacing}
            endSpacing={END_PADDING}
            roundedTop
            yAxisThickness={0}
            xAxisThickness={0}
            noOfSections={4}
            maxValue={800}
            isAnimated
            animationDuration={620}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}
