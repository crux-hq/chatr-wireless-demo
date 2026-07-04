import { useEffect, useState } from 'react';
import { View, Text, Pressable, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Plus, Minus } from 'lucide-react-native';
import type { PhoneSpecSection } from '@/lib/mock/types';
import { useAppStore } from '@/lib/store';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const ANIMATION_DURATION = 280;
const ANIMATION_EASING = Easing.bezier(0.4, 0, 0.2, 1);

function SpecSectionBody({
  section,
  locale,
}: {
  section: PhoneSpecSection;
  locale: 'en' | 'fr';
}) {
  return (
    <>
      {section.rows.map((row, index) => {
        const label = locale === 'fr' ? row.labelFr : row.labelEn;
        const value = locale === 'fr' ? row.valueFr : row.valueEn;
        return (
          <View
            key={`${section.id}-${index}`}
            style={{
              marginTop: spacing.sm,
              paddingTop: spacing.sm,
              borderTopWidth: index === 0 ? 1 : 0,
              borderTopColor: colors.grayMid,
            }}>
            <Text style={{ fontFamily: fonts.semiBold, fontSize: 14, color: colors.textMuted }}>{label}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 15, color: colors.text, marginTop: 2 }}>{value}</Text>
          </View>
        );
      })}
    </>
  );
}

function SpecSectionRow({
  section,
  expanded,
  locale,
  onToggle,
}: {
  section: PhoneSpecSection;
  expanded: boolean;
  locale: 'en' | 'fr';
  onToggle: () => void;
}) {
  const title = locale === 'fr' ? section.titleFr : section.titleEn;
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
    <Pressable
      onPress={onToggle}
      style={{
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.grayMid,
        overflow: 'hidden',
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.text, flex: 1 }}>{title}</Text>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.lavenderLight,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Animated.View style={[{ position: 'absolute' }, plusStyle]}>
            <Plus size={18} color={colors.primary} />
          </Animated.View>
          <Animated.View style={[{ position: 'absolute' }, minusStyle]}>
            <Minus size={18} color={colors.primary} />
          </Animated.View>
        </View>
      </View>

      <View pointerEvents="none" style={{ position: 'absolute', opacity: 0, left: 0, right: 0 }} onLayout={onMeasureBody}>
        <SpecSectionBody section={section} locale={locale} />
      </View>
      <Animated.View style={bodyWrapStyle}>
        <SpecSectionBody section={section} locale={locale} />
      </Animated.View>
    </Pressable>
  );
}

export function PhoneSpecs({ sections }: { sections: PhoneSpecSection[] }) {
  const locale = useAppStore((s) => s.locale);
  const [expandedId, setExpandedId] = useState<string | null>(sections[0]?.id ?? null);

  return (
    <View style={{ gap: spacing.sm }}>
      {sections.map((section) => (
        <SpecSectionRow
          key={section.id}
          section={section}
          locale={locale}
          expanded={expandedId === section.id}
          onToggle={() => setExpandedId(expandedId === section.id ? null : section.id)}
        />
      ))}
    </View>
  );
}
