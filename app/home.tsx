import { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ChevronLeft, Star, MapPin, Plus } from 'lucide-react-native';
import { MarketingHeader } from '@/components/homepage/MarketingHeader';
import { HomeFooter } from '@/components/homepage/HomeFooter';
import { HomeAccordion } from '@/components/homepage/HomeAccordion';
import { CtaButton } from '@/components/ui/Button';
import {
  HERO_BADGE,
  HERO_SLIDES,
  PROMO_CARDS,
  HOW_IT_WORKS_STEPS,
  WHY_CHATR_ITEMS,
  TESTIMONIALS,
  COVERAGE_FEATURES,
  HOMEPAGE_FAQ,
} from '@/lib/homepage-data';
import { launchJourneyById } from '@/lib/launch-journey';
import { useAppStore } from '@/lib/store';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_WIDTH = Math.min(SCREEN_WIDTH, 480);

function HeroTitle({ slide }: { slide: (typeof HERO_SLIDES)[number] }) {
  const baseStyle = {
    fontSize: 32,
    lineHeight: 40,
    color: colors.white,
    textAlign: 'left' as const,
    marginBottom: spacing.md,
  };

  if (slide.id === '50gb') {
    return (
      <Text style={{ ...baseStyle, fontFamily: fonts.regular }}>
        <Text style={{ fontFamily: fonts.bold }}>Get 50GB</Text>{' '}
        of Data and Unlimited US Calling{' '}
        <Text style={{ fontFamily: fonts.bold }}>for $34!!*</Text>
      </Text>
    );
  }

  return <Text style={{ ...baseStyle, fontFamily: fonts.bold }}>{slide.title}</Text>;
}

const PROMO_ICON_SIZE = 90;
const PROMO_ICON_SHADOW_OFFSET = 10;
const STEPS_CARD_PEEK = spacing.lg;
const STEPS_CARD_GAP = spacing.md;
const STEPS_CARD_WIDTH = SCREEN_WIDTH - spacing.lg * 2 - STEPS_CARD_PEEK;

function CarouselDots({ count, active, tone = 'dark' }: { count: number; active: number; tone?: 'light' | 'dark' }) {
  const inactiveColor = tone === 'dark' ? 'rgba(255,255,255,0.4)' : colors.grayMid;
  const activeColor = tone === 'dark' ? colors.white : colors.primary;

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === active ? 20 : 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: i === active ? activeColor : inactiveColor,
          }}
        />
      ))}
    </View>
  );
}

function CarouselControls({
  count,
  active,
  onPrevious,
  onNext,
  tone = 'dark',
  style,
}: {
  count: number;
  active: number;
  onPrevious: () => void;
  onNext: () => void;
  tone?: 'light' | 'dark';
  style?: object;
}) {
  const borderColor = tone === 'dark' ? 'rgba(255,255,255,0.5)' : colors.grayMid;
  const iconColor = tone === 'dark' ? colors.white : colors.primary;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: spacing.md,
          paddingHorizontal: spacing.lg,
        },
        style,
      ]}>
      <Pressable
        onPress={onPrevious}
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          borderWidth: 1,
          borderColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ChevronLeft color={iconColor} size={20} />
      </Pressable>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <CarouselDots count={count} active={active} tone={tone} />
      </View>
      <Pressable
        onPress={onNext}
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          borderWidth: 1,
          borderColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ChevronRight color={iconColor} size={20} />
      </Pressable>
    </View>
  );
}

export default function HomeScreen() {
  const signIn = useAppStore((s) => s.signIn);
  const signOut = useAppStore((s) => s.signOut);
  const applyScenario = useAppStore((s) => s.applyScenario);

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [stepsIndex, setStepsIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [whyExpanded, setWhyExpanded] = useState<string | null>('affordable');
  const [faqExpanded, setFaqExpanded] = useState<string | null>('roaming');

  const heroRef = useRef<ScrollView>(null);
  const stepsRef = useRef<ScrollView>(null);

  const launch = async (journeyId: string) => {
    setLoadingId(journeyId);
    try {
      await launchJourneyById(journeyId, { signIn, signOut, applyScenario });
    } finally {
      setLoadingId(null);
    }
  };

  const onHeroScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    setHeroIndex(Math.round(x / SCREEN_WIDTH));
  };

  const onStepsScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    setStepsIndex(Math.round(x / (STEPS_CARD_WIDTH + STEPS_CARD_GAP)));
  };

  const scrollToStep = (index: number) => {
    stepsRef.current?.scrollTo({ x: index * (STEPS_CARD_WIDTH + STEPS_CARD_GAP), animated: true });
    setStepsIndex(index);
  };

  const currentHero = HERO_SLIDES[heroIndex];
  const currentTestimonial = TESTIMONIALS[testimonialIndex];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, backgroundColor: colors.lavender }}>
        <MarketingHeader onLaunchJourney={(id) => void launch(id)} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Hero */}
          <View style={{ backgroundColor: colors.primary, paddingBottom: spacing.xl }}>
            <View
              style={{
                alignItems: 'flex-start',
                paddingTop: spacing.lg,
                paddingHorizontal: spacing.lg,
                marginBottom: spacing.sm,
              }}>
              <View
                style={{
                  backgroundColor: 'rgba(253, 251, 255, 0.24)',
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs + 2,
                  borderRadius: radius.sm,
                }}>
                <Text
                  style={{
                    fontFamily: fonts.semiBold,
                    fontSize: 12,
                    lineHeight: 16,
                    color: colors.white,
                    textAlign: 'left',
                  }}>
                  {HERO_BADGE}
                </Text>
              </View>
            </View>
            <ScrollView
              ref={heroRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onHeroScroll}
              style={{ width: SCREEN_WIDTH }}>
              {HERO_SLIDES.map((slide) => (
                <View key={slide.id} style={{ width: SCREEN_WIDTH, paddingHorizontal: spacing.lg, paddingTop: spacing.sm }}>
                  <HeroTitle slide={slide} />
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: 16,
                      lineHeight: 24,
                      color: colors.lavenderMid,
                      textAlign: 'left',
                    }}>
                    {slide.subtitle}
                  </Text>
                  <Image
                    source={slide.image}
                    style={{
                      width: SCREEN_WIDTH - spacing.lg * 2,
                      maxHeight: 244,
                      height: 244,
                      alignSelf: 'center',
                      marginTop: spacing.lg,
                      marginBottom: spacing.lg + 5,
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              ))}
            </ScrollView>

            <View style={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}>
              <CtaButton
                title="Shop now"
                size="compact"
                onPress={() => void launch(currentHero.shopJourneyId)}
                loading={loadingId === currentHero.shopJourneyId}
                style={{ marginBottom: spacing.xs }}
              />
              <CtaButton
                title="View details"
                variant="outline"
                size="compact"
                onPress={() => void launch(currentHero.detailsJourneyId)}
                loading={loadingId === currentHero.detailsJourneyId}
                style={{ marginBottom: spacing.xs }}
              />
            </View>

            <CarouselControls
              count={HERO_SLIDES.length}
              active={heroIndex}
              onPrevious={() => {
                const next = Math.max(0, heroIndex - 1);
                heroRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
                setHeroIndex(next);
              }}
              onNext={() => {
                const next = Math.min(HERO_SLIDES.length - 1, heroIndex + 1);
                heroRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
                setHeroIndex(next);
              }}
            />
          </View>

          {/* Promo cards */}
          <View style={{ padding: spacing.lg, gap: spacing.md, backgroundColor: colors.white }}>
            {PROMO_CARDS.map((card) => (
              <View
                key={card.id}
                style={{
                  backgroundColor: colors.lavenderLight,
                  borderRadius: radius.lg,
                  padding: spacing.lg,
                  marginVertical: spacing.sm,
                  shadowColor: colors.primaryCharcoal,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  elevation: 2,
                }}>
                <Image
                  source={card.icon}
                  style={{
                    width: PROMO_ICON_SIZE,
                    height: PROMO_ICON_SIZE,
                    marginBottom: spacing.sm,
                    marginLeft: -PROMO_ICON_SHADOW_OFFSET,
                    alignSelf: 'flex-start',
                  }}
                />
                <Text
                  style={{
                    fontFamily: fonts.semiBold,
                    fontSize: 32,
                    lineHeight: 40,
                    color: colors.primary,
                    marginBottom: spacing.md,
                  }}>
                  {card.title}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 16,
                    color: '#000',
                    lineHeight: 24,
                  }}>
                  {card.body}
                </Text>
                <View style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
                  <CtaButton
                    title={card.cta}
                    onPress={() => void launch(card.journeyId)}
                    loading={loadingId === card.journeyId}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* How it works */}
          <View style={{ backgroundColor: colors.primaryCharcoal, padding: spacing.lg, paddingBottom: spacing.xl, alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: 32,
                lineHeight: 40,
                color: colors.white,
                marginBottom: spacing.xl,
                textAlign: 'center',
                alignSelf: 'stretch',
              }}>
              How it works
            </Text>
            <ScrollView
              ref={stepsRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={STEPS_CARD_WIDTH + STEPS_CARD_GAP}
              snapToAlignment="start"
              onMomentumScrollEnd={onStepsScroll}
              style={{ alignSelf: 'stretch' }}
              contentContainerStyle={{ paddingRight: spacing.lg }}>
              {HOW_IT_WORKS_STEPS.map((step, index) => (
                <View
                  key={step.step}
                  style={{
                    width: STEPS_CARD_WIDTH,
                    marginRight: index < HOW_IT_WORKS_STEPS.length - 1 ? STEPS_CARD_GAP : 0,
                    backgroundColor: 'transparent',
                    borderRadius: radius.lg,
                    borderWidth: 2,
                    borderColor: 'rgba(255,255,255,0.12)',
                    padding: spacing.lg,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: colors.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: spacing.md,
                    }}>
                    <Text style={{ fontFamily: fonts.bold, fontSize: 22, color: colors.white }}>{step.step}</Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: fonts.semiBold,
                      fontSize: 24,
                      lineHeight: 30,
                      color: colors.white,
                      marginBottom: spacing.sm,
                      textAlign: 'center',
                    }}>
                    {step.title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: 16,
                      color: colors.lavenderMid,
                      marginTop: spacing.sm,
                      lineHeight: 24,
                      textAlign: 'center',
                    }}>
                    {step.body}
                  </Text>
                  <View style={{ marginTop: spacing.md, alignSelf: 'stretch' }}>
                    <CtaButton
                      title={step.cta}
                      variant="outline"
                      size="compact"
                      onPress={() => void launch(step.journeyId)}
                      loading={loadingId === step.journeyId}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>

            <CarouselControls
              count={HOW_IT_WORKS_STEPS.length}
              active={stepsIndex}
              onPrevious={() => scrollToStep(Math.max(0, stepsIndex - 1))}
              onNext={() => scrollToStep(Math.min(HOW_IT_WORKS_STEPS.length - 1, stepsIndex + 1))}
              style={{ marginTop: spacing.lg, paddingHorizontal: 0, alignSelf: 'stretch' }}
            />
          </View>

          {/* Why Chatr */}
          <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.xl }}>
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: 32,
                lineHeight: 40,
                color: colors.primary,
                marginTop: spacing.xl,
                marginBottom: spacing.xxl,
                textAlign: 'center',
              }}>
              Why Chatr?
            </Text>
            <HomeAccordion
              items={WHY_CHATR_ITEMS}
              expandedId={whyExpanded}
              onToggle={(id) => setWhyExpanded(whyExpanded === id ? null : id)}
              showThumbsUp
            />
            <LinearGradient
              colors={['rgba(222, 201, 255, 0.2)', 'rgba(222, 201, 255, 0.5)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                width: '100%',
                marginTop: spacing.lg,
                paddingTop: 10,
                borderRadius: radius.lg,
                overflow: 'hidden',
              }}>
              <Image
                source={require('@/assets/images/homepage/why-chatr-person.png')}
                style={{
                  width: '100%',
                  height: 320,
                  resizeMode: 'contain',
                }}
              />
            </LinearGradient>
            <CtaButton
              title="Get started"
              onPress={() => void launch('activate')}
              loading={loadingId === 'activate'}
              style={{ marginTop: 20 }}
            />
          </View>

          {/* Testimonials */}
          <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.xl, backgroundColor: colors.white }}>
            <View
              style={{
                backgroundColor: colors.lavenderLight,
                borderRadius: radius.button,
                paddingTop: spacing.lg,
                paddingBottom: spacing.lg,
                paddingHorizontal: spacing.md,
              }}>
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: 17,
                  lineHeight: 22,
                  color: '#593494',
                  marginBottom: spacing.sm,
                  textAlign: 'left',
                }}>
                Testimonials
              </Text>
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: 32,
                  lineHeight: 40,
                  color: colors.primary,
                  marginBottom: spacing.xl,
                  textAlign: 'left',
                }}>
                What our customers say about us
              </Text>
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
                    {currentTestimonial.quote}
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
                    <Image source={currentTestimonial.avatar} style={{ width: 56, height: 56, borderRadius: 28 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: fonts.semiBold, fontSize: 15, color: colors.text, marginBottom: spacing.xs }}>
                        {currentTestimonial.name}
                      </Text>
                      <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.textMuted }}>
                        {currentTestimonial.role}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 2, marginTop: spacing.sm }}>
                    {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                      <Star key={i} size={16} color={colors.accent} fill={colors.accent} />
                    ))}
                  </View>
                </View>
              </View>

              <CarouselControls
                count={TESTIMONIALS.length}
                active={testimonialIndex}
                onPrevious={() => setTestimonialIndex((i) => Math.max(0, i - 1))}
                onNext={() => setTestimonialIndex((i) => Math.min(TESTIMONIALS.length - 1, i + 1))}
                tone="light"
                style={{ paddingHorizontal: 0 }}
              />

              <View style={{ marginTop: spacing.lg }}>
                <CtaButton title="All reviews" onPress={() => void launch('support')} loading={loadingId === 'support'} />
              </View>
            </View>
          </View>

          {/* Network coverage */}
          <View style={{ backgroundColor: '#292234', overflow: 'hidden' }}>
            <Image
              source={require('@/assets/images/homepage/radiotower.png')}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                width: '100%',
                height: SCREEN_WIDTH,
                resizeMode: 'contain',
              }}
              pointerEvents="none"
            />
            <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xxl, minHeight: 870 }}>
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: 16,
                color: colors.accent,
                textAlign: 'left',
                marginBottom: spacing.sm,
              }}>
              Our Coverage
            </Text>
            <Text style={{ fontFamily: fonts.semiBold, fontSize: 40, color: colors.white, textAlign: 'left', marginBottom: spacing.lg }}>
              Our outstanding network coverage
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 16,
                color: colors.lavenderMid,
                textAlign: 'left',
                marginBottom: spacing.lg,
              }}>
              Enjoy reliable coverage across the country.
            </Text>
            <View>
              {COVERAGE_FEATURES.map((feature) => {
                const Icon = feature.id === 'nationwide' ? MapPin : Plus;
                return (
                <View
                  key={feature.id}
                  style={{
                    backgroundColor: '#383046',
                    borderRadius: radius.md,
                    padding: spacing.md,
                    marginBottom: spacing.lg,
                  }}>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: radius.sm,
                          backgroundColor: 'transparent',
                          borderWidth: 1,
                          borderColor: colors.white,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: spacing.md,
                          flexShrink: 0,
                        }}>
                        <Icon size={18} color={colors.white} />
                      </View>
                      <Text style={{ fontFamily: fonts.semiBold, fontSize: 18, color: colors.white, flex: 1 }}>
                        {feature.title}
                      </Text>
                    </View>
                    <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.lavenderMid }}>
                      {feature.body}
                    </Text>
                  </View>
                </View>
              );
              })}
            </View>
            <View style={{ marginTop: 'auto' }}>
              <CtaButton title="Network coverage" onPress={() => void launch('coverage')} loading={loadingId === 'coverage'} />
            </View>
            </View>
          </View>

          {/* FAQ */}
          <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.xl }}>
            <Text style={{ fontFamily: fonts.semiBold, fontSize: 32, lineHeight: 40, color: '#593494', textAlign: 'center' }}>
              Got some questions for us?
            </Text>
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: 32,
                lineHeight: 40,
                color: '#000000',
                marginBottom: spacing.xl,
                textAlign: 'center',
              }}>
              We've got you covered
            </Text>
            <HomeAccordion
              items={HOMEPAGE_FAQ.map((item) => ({
                id: item.id,
                title: item.question,
                body: item.answer,
                journeyId: item.journeyId,
              }))}
              expandedId={faqExpanded}
              onToggle={(id) => setFaqExpanded(faqExpanded === id ? null : id)}
              onLaunchJourney={(id) => void launch(id)}
            />
          </View>

          <HomeFooter onLaunchJourney={(id) => void launch(id)} />
        </ScrollView>
      </View>
    </>
  );
}
