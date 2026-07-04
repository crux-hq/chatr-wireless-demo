import { useRef, useState } from 'react';
import { View, Text, Image, ScrollView, Dimensions, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react-native';
import { CtaButton } from '@/components/ui/Button';
import { CarouselControls } from '@/components/ui/CarouselControls';
import { TESTIMONIALS } from '@/lib/homepage-data';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = spacing.md;
const CARD_WIDTH = SCREEN_WIDTH - spacing.lg * 2 - spacing.md * 2;
const SLIDE_WIDTH = CARD_WIDTH + CARD_GAP;

type Testimonial = (typeof TESTIMONIALS)[number];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        gap: 1,
        shadowColor: colors.primaryCharcoal,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}>
      <View
        style={{
          backgroundColor: colors.white,
          borderTopLeftRadius: radius.lg,
          borderTopRightRadius: radius.lg,
          padding: spacing.lg,
          paddingBottom: spacing.md,
        }}>
        <Image
          source={require('@/assets/images/homepage/quote-icon.png')}
          style={{ width: 31.29, height: 22.73, marginBottom: spacing.md }}
        />
        <Text style={{ fontFamily: fonts.regular, fontSize: 24, lineHeight: 30, color: colors.text }}>
          {t(testimonial.quoteKey)}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: colors.white,
          borderBottomLeftRadius: radius.lg,
          borderBottomRightRadius: radius.lg,
          padding: spacing.lg,
          paddingTop: spacing.md,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <Image source={testimonial.avatar} style={{ width: 56, height: 56, borderRadius: 28 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.semiBold, fontSize: 15, color: colors.text, marginBottom: spacing.xs }}>
              {t(testimonial.nameKey)}
            </Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.textMuted }}>{t(testimonial.roleKey)}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 2, marginTop: spacing.sm }}>
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} size={16} color={colors.accent} fill={colors.accent} />
          ))}
        </View>
      </View>
    </View>
  );
}

type TestimonialCarouselProps = {
  onAllReviews: () => void;
  loading?: boolean;
};

export function TestimonialCarousel({ onAllReviews, loading }: TestimonialCarouselProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const syncIndex = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    setIndex(Math.max(0, Math.min(TESTIMONIALS.length - 1, next)));
  };

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(TESTIMONIALS.length - 1, next));
    scrollRef.current?.scrollTo({ x: clamped * SLIDE_WIDTH, animated: true });
    setIndex(clamped);
  };

  return (
    <>
      <ScrollView
        ref={scrollRef}
        horizontal
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={syncIndex}
        onScrollEndDrag={syncIndex}
        onMomentumScrollEnd={syncIndex}
        style={{ width: CARD_WIDTH }}
        snapToInterval={SLIDE_WIDTH}
        snapToAlignment="start"
        disableIntervalMomentum>
        {TESTIMONIALS.map((testimonial, itemIndex) => (
          <View
            key={testimonial.id}
            style={{
              width: CARD_WIDTH,
              marginRight: itemIndex < TESTIMONIALS.length - 1 ? CARD_GAP : 0,
            }}>
            <TestimonialCard testimonial={testimonial} />
          </View>
        ))}
      </ScrollView>

      <CarouselControls
        count={TESTIMONIALS.length}
        active={index}
        onPrevious={() => goTo(index - 1)}
        onNext={() => goTo(index + 1)}
        tone="light"
        style={{ paddingHorizontal: 0 }}
      />

      <View style={{ marginTop: spacing.lg }}>
        <CtaButton title={t('homepage.testimonials.allReviews')} onPress={onAllReviews} loading={loading} />
      </View>
    </>
  );
}
