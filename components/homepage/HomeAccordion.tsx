import { useEffect, useState } from 'react';
import { View, Text, Pressable, type LayoutChangeEvent } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Plus, Minus, ThumbsUp } from 'lucide-react-native';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const ACCORDION_PURPLE = '#593494';
const ICON_BG_COLLAPSED = '#F6F3FB';
const ANIMATION_DURATION = 280;
const ANIMATION_EASING = Easing.bezier(0.4, 0, 0.2, 1);

type HomeAccordionItem = {
  id: string;
  title: string;
  body?: string;
  journeyId?: string;
};

type HomeAccordionProps = {
  items: readonly HomeAccordionItem[];
  expandedId: string | null;
  onToggle: (id: string) => void;
  variant?: 'light' | 'dark';
  showThumbsUp?: boolean;
  onLaunchJourney?: (journeyId: string) => void;
};

type AccordionRowProps = {
  item: HomeAccordionItem;
  expanded: boolean;
  isDark: boolean;
  showThumbsUp: boolean;
  onToggle: () => void;
  onLaunchJourney?: (journeyId: string) => void;
};

function AccordionBodyContent({
  item,
  onLaunchJourney,
}: {
  item: HomeAccordionItem;
  onLaunchJourney?: (journeyId: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      <View
        style={{
          height: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.24)',
          marginTop: spacing.md,
          marginBottom: spacing.md,
          marginHorizontal: -spacing.md,
          alignSelf: 'stretch',
        }}
      />
      <Text
        style={{
          fontFamily: fonts.regular,
          fontSize: 16,
          lineHeight: 24,
          color: colors.white,
        }}>
        {item.body}
      </Text>
      {item.journeyId && onLaunchJourney ? (
        <Pressable onPress={() => onLaunchJourney(item.journeyId!)} style={{ marginTop: spacing.sm }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.accent }}>{t('common.learnMore')} ›</Text>
        </Pressable>
      ) : null}
    </>
  );
}

function AccordionRow({
  item,
  expanded,
  isDark,
  showThumbsUp,
  onToggle,
  onLaunchJourney,
}: AccordionRowProps) {
  const progress = useSharedValue(expanded ? 1 : 0);
  const bodyHeight = useSharedValue(0);
  const [measuredBodyHeight, setMeasuredBodyHeight] = useState(0);

  useEffect(() => {
    progress.value = withTiming(expanded ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
  }, [expanded, progress]);

  useEffect(() => {
    bodyHeight.value = withTiming(expanded ? measuredBodyHeight : 0, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    });
  }, [expanded, measuredBodyHeight, bodyHeight]);

  const onMeasureBody = (event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height;
    if (nextHeight > 0 && nextHeight !== measuredBodyHeight) {
      setMeasuredBodyHeight(nextHeight);
      if (expanded) {
        bodyHeight.value = nextHeight;
      }
    }
  };

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.white, ACCORDION_PURPLE]),
  }));

  const titleStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [colors.text, colors.white]),
  }));

  const iconWrapStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [ICON_BG_COLLAPSED, 'rgba(255, 255, 255, 0.22)']),
  }));

  const plusStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5], [1, 0], 'clamp'),
  }));

  const minusStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.5, 1], [0, 1], 'clamp'),
  }));

  const bodyWrapStyle = useAnimatedStyle(() => ({
    height: bodyHeight.value,
    opacity: interpolate(progress.value, [0, 0.35, 1], [0, 1, 1]),
    overflow: 'hidden',
  }));

  return (
    <Pressable onPress={onToggle}>
      <Animated.View
        style={[
          {
            borderRadius: radius.lg,
            padding: spacing.md,
            borderWidth: isDark ? 1 : 0,
            borderColor: colors.primaryLight,
            overflow: 'hidden',
          },
          containerStyle,
        ]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {showThumbsUp ? (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.sm,
                backgroundColor: colors.lavenderLight,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.md,
              }}>
              <ThumbsUp size={22} color={colors.primary} />
            </View>
          ) : null}
          <Animated.Text
            style={[
              {
                fontFamily: fonts.semiBold,
                fontSize: 24,
                lineHeight: 30,
                flex: 1,
                paddingRight: spacing.sm,
              },
              titleStyle,
            ]}>
            {item.title}
          </Animated.Text>
          <Animated.View
            style={[
              {
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
              },
              iconWrapStyle,
            ]}>
            <Animated.View style={[{ position: 'absolute' }, plusStyle]}>
              <Plus size={20} color={colors.primary} />
            </Animated.View>
            <Animated.View style={[{ position: 'absolute' }, minusStyle]}>
              <Minus size={20} color={colors.white} />
            </Animated.View>
          </Animated.View>
        </View>

        {item.body ? (
          <>
            <View
              pointerEvents="none"
              style={{ position: 'absolute', opacity: 0, left: spacing.md, right: spacing.md }}
              onLayout={onMeasureBody}>
              <AccordionBodyContent item={item} onLaunchJourney={onLaunchJourney} />
            </View>
            <Animated.View style={bodyWrapStyle}>
              <AccordionBodyContent item={item} onLaunchJourney={onLaunchJourney} />
            </Animated.View>
          </>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

export function HomeAccordion({
  items,
  expandedId,
  onToggle,
  variant = 'light',
  showThumbsUp = false,
  onLaunchJourney,
}: HomeAccordionProps) {
  const isDark = variant === 'dark';

  return (
    <View style={{ gap: spacing.lg }}>
      {items.map((item) => (
        <AccordionRow
          key={item.id}
          item={item}
          expanded={expandedId === item.id}
          isDark={isDark}
          showThumbsUp={showThumbsUp}
          onToggle={() => onToggle(item.id)}
          onLaunchJourney={onLaunchJourney}
        />
      ))}
    </View>
  );
}

export type { HomeAccordionItem };
