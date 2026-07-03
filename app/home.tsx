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
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react-native';
import { MarketingHeader } from '@/components/homepage/MarketingHeader';
import { HomeFooter } from '@/components/homepage/HomeFooter';
import { HomeAccordion } from '@/components/homepage/HomeAccordion';
import {
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

function CtaButton({
  title,
  onPress,
  variant = 'primary',
  loading,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  loading?: boolean;
}) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={{
        backgroundColor: isPrimary ? colors.accent : 'transparent',
        borderWidth: isPrimary ? 0 : 2,
        borderColor: colors.white,
        borderRadius: radius.pill,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 4,
        opacity: loading ? 0.7 : 1,
      }}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.textOnAccent : colors.white} />
      ) : (
        <>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 16,
              color: isPrimary ? colors.textOnAccent : colors.white,
            }}>
            {title}
          </Text>
          <ChevronRight size={18} color={isPrimary ? colors.textOnAccent : colors.white} />
        </>
      )}
    </Pressable>
  );
}

function CarouselDots({ count, active }: { count: number; active: number }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: spacing.md }}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === active ? 20 : 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: i === active ? colors.accent : 'rgba(255,255,255,0.4)',
          }}
        />
      ))}
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
    setHeroIndex(Math.round(x / CONTENT_WIDTH));
  };

  const currentHero = HERO_SLIDES[heroIndex];
  const currentStep = HOW_IT_WORKS_STEPS[stepsIndex];
  const currentTestimonial = TESTIMONIALS[testimonialIndex];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, backgroundColor: colors.lavender }}>
        <MarketingHeader onLaunchJourney={(id) => void launch(id)} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Hero */}
          <View style={{ backgroundColor: colors.primary, paddingBottom: spacing.xl }}>
            <ScrollView
              ref={heroRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onHeroScroll}
              style={{ width: CONTENT_WIDTH, alignSelf: 'center' }}>
              {HERO_SLIDES.map((slide) => (
                <View key={slide.id} style={{ width: CONTENT_WIDTH, paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
                  <Text
                    style={{
                      fontFamily: fonts.extraBold,
                      fontSize: 26,
                      lineHeight: 32,
                      color: colors.white,
                      textAlign: 'center',
                    }}>
                    {slide.title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: 15,
                      lineHeight: 22,
                      color: colors.lavenderMid,
                      textAlign: 'center',
                      marginTop: spacing.sm,
                    }}>
                    {slide.subtitle}
                  </Text>
                  <Image
                    source={slide.image}
                    style={{
                      width: CONTENT_WIDTH - spacing.lg * 2,
                      height: 280,
                      alignSelf: 'center',
                      marginVertical: spacing.lg,
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              ))}
            </ScrollView>

            <View style={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}>
              <CtaButton
                title="Shop now"
                onPress={() => void launch(currentHero.shopJourneyId)}
                loading={loadingId === currentHero.shopJourneyId}
              />
              <CtaButton
                title="View details"
                variant="outline"
                onPress={() => void launch(currentHero.detailsJourneyId)}
                loading={loadingId === currentHero.detailsJourneyId}
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.md, gap: spacing.md }}>
              <Pressable
                onPress={() => {
                  const next = Math.max(0, heroIndex - 1);
                  heroRef.current?.scrollTo({ x: next * CONTENT_WIDTH, animated: true });
                  setHeroIndex(next);
                }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.5)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ChevronLeft color={colors.white} size={20} />
              </Pressable>
              <CarouselDots count={HERO_SLIDES.length} active={heroIndex} />
              <Pressable
                onPress={() => {
                  const next = Math.min(HERO_SLIDES.length - 1, heroIndex + 1);
                  heroRef.current?.scrollTo({ x: next * CONTENT_WIDTH, animated: true });
                  setHeroIndex(next);
                }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.5)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ChevronRight color={colors.white} size={20} />
              </Pressable>
            </View>
          </View>

          {/* Promo cards */}
          <View style={{ padding: spacing.lg, gap: spacing.md }}>
            {PROMO_CARDS.map((card) => (
              <View
                key={card.id}
                style={{
                  backgroundColor: colors.white,
                  borderRadius: radius.lg,
                  padding: spacing.lg,
                  shadowColor: colors.primaryCharcoal,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  elevation: 2,
                }}>
                <Image source={card.icon} style={{ width: 56, height: 56, marginBottom: spacing.md }} />
                <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.text }}>{card.title}</Text>
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 14,
                    color: colors.textMuted,
                    marginTop: spacing.xs,
                    lineHeight: 20,
                  }}>
                  {card.body}
                </Text>
                <View style={{ marginTop: spacing.md }}>
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
          <View style={{ backgroundColor: colors.primaryCharcoal, padding: spacing.lg, paddingBottom: spacing.xl }}>
            <Text style={{ fontFamily: fonts.extraBold, fontSize: 24, color: colors.white, marginBottom: spacing.lg }}>
              How it works
            </Text>
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.12)',
                padding: spacing.lg,
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
                <Text style={{ fontFamily: fonts.extraBold, fontSize: 22, color: colors.white }}>{currentStep.step}</Text>
              </View>
              <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: colors.white }}>{currentStep.title}</Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  color: colors.lavenderMid,
                  marginTop: spacing.sm,
                  lineHeight: 22,
                }}>
                {currentStep.body}
              </Text>
              <Pressable onPress={() => void launch(currentStep.journeyId)} style={{ marginTop: spacing.md }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.accent }}>
                  {currentStep.cta} ›
                </Text>
              </Pressable>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.lg, gap: spacing.md }}>
              <Pressable
                onPress={() => setStepsIndex((i) => Math.max(0, i - 1))}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.4)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ChevronLeft color={colors.white} size={20} />
              </Pressable>
              <CarouselDots count={HOW_IT_WORKS_STEPS.length} active={stepsIndex} />
              <Pressable
                onPress={() => setStepsIndex((i) => Math.min(HOW_IT_WORKS_STEPS.length - 1, i + 1))}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.4)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ChevronRight color={colors.white} size={20} />
              </Pressable>
            </View>
          </View>

          {/* Social proof */}
          <View style={{ paddingVertical: spacing.lg, alignItems: 'center' }}>
            <Image
              source={require('@/assets/images/homepage/social-proof.png')}
              style={{ width: CONTENT_WIDTH - spacing.lg * 2, height: 120, resizeMode: 'contain' }}
            />
          </View>

          {/* Why Chatr */}
          <View style={{ padding: spacing.lg }}>
            <Text style={{ fontFamily: fonts.extraBold, fontSize: 24, color: colors.text, marginBottom: spacing.lg }}>
              Why Chatr?
            </Text>
            <HomeAccordion
              items={WHY_CHATR_ITEMS}
              expandedId={whyExpanded}
              onToggle={(id) => setWhyExpanded(whyExpanded === id ? null : id)}
            />
            <Image
              source={require('@/assets/images/homepage/why-chatr-person.png')}
              style={{
                width: '100%',
                height: 320,
                resizeMode: 'contain',
                marginTop: spacing.lg,
              }}
            />
            <CtaButton title="Get started" onPress={() => void launch('activate')} loading={loadingId === 'activate'} />
          </View>

          {/* Testimonials */}
          <View style={{ padding: spacing.lg, paddingTop: 0 }}>
            <Text style={{ fontFamily: fonts.extraBold, fontSize: 24, color: colors.text, marginBottom: spacing.lg }}>
              What our customers say about us
            </Text>
            <View
              style={{
                backgroundColor: colors.white,
                borderRadius: radius.lg,
                padding: spacing.lg,
                shadowColor: colors.primaryCharcoal,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}>
              <Image
                source={require('@/assets/images/homepage/quote-icon.png')}
                style={{ width: 32, height: 24, marginBottom: spacing.md }}
              />
              <Text style={{ fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, color: colors.text }}>
                {currentTestimonial.quote}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, gap: spacing.md }}>
                <Image source={currentTestimonial.avatar} style={{ width: 48, height: 48, borderRadius: 24 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.semiBold, fontSize: 15, color: colors.text }}>
                    {currentTestimonial.name}
                  </Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>
                    {currentTestimonial.role}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 2 }}>
                  {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                    <Star key={i} size={16} color={colors.accent} fill={colors.accent} />
                  ))}
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.md, gap: spacing.md }}>
              <Pressable
                onPress={() => setTestimonialIndex((i) => Math.max(0, i - 1))}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.grayMid,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ChevronLeft color={colors.primary} size={20} />
              </Pressable>
              <CarouselDots count={TESTIMONIALS.length} active={testimonialIndex} />
              <Pressable
                onPress={() => setTestimonialIndex((i) => Math.min(TESTIMONIALS.length - 1, i + 1))}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.grayMid,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ChevronRight color={colors.primary} size={20} />
              </Pressable>
            </View>

            <View style={{ marginTop: spacing.lg }}>
              <CtaButton title="All reviews" onPress={() => void launch('support')} loading={loadingId === 'support'} />
            </View>
          </View>

          {/* Network coverage */}
          <View style={{ backgroundColor: colors.primary, marginHorizontal: spacing.lg, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg }}>
            <Text style={{ fontFamily: fonts.extraBold, fontSize: 22, color: colors.white, textAlign: 'center' }}>
              Our outstanding network coverage
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 14,
                color: colors.lavenderMid,
                textAlign: 'center',
                marginTop: spacing.sm,
              }}>
              Enjoy reliable coverage across the country.
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
              {COVERAGE_FEATURES.map((feature) => (
                <View
                  key={feature.id}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: radius.md,
                    padding: spacing.md,
                  }}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.white }}>{feature.title}</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.lavenderMid, marginTop: 4 }}>
                    {feature.body}
                  </Text>
                </View>
              ))}
            </View>
            <Image
              source={require('@/assets/images/homepage/celebrate-person.png')}
              style={{ width: '100%', height: 200, resizeMode: 'contain', marginTop: spacing.md }}
            />
            <View style={{ marginTop: spacing.md }}>
              <CtaButton title="Network coverage" onPress={() => void launch('coverage')} loading={loadingId === 'coverage'} />
            </View>
          </View>

          {/* FAQ */}
          <View style={{ padding: spacing.lg, paddingTop: 0 }}>
            <Text style={{ fontFamily: fonts.extraBold, fontSize: 22, color: colors.text, marginBottom: spacing.lg }}>
              Got some questions for us? We've got you covered
            </Text>
            <View style={{ gap: spacing.sm }}>
              {HOMEPAGE_FAQ.map((item) => {
                const expanded = faqExpanded === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setFaqExpanded(expanded ? null : item.id)}
                    style={{
                      backgroundColor: expanded ? colors.primary : colors.white,
                      borderRadius: radius.lg,
                      padding: spacing.md,
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text
                        style={{
                          fontFamily: fonts.semiBold,
                          fontSize: 15,
                          color: expanded ? colors.white : colors.text,
                          flex: 1,
                          paddingRight: spacing.sm,
                        }}>
                        {item.question}
                      </Text>
                      <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: expanded ? colors.white : colors.primary }}>
                        {expanded ? '−' : '+'}
                      </Text>
                    </View>
                    {expanded ? (
                      <>
                        <Text
                          style={{
                            fontFamily: fonts.regular,
                            fontSize: 14,
                            lineHeight: 22,
                            color: colors.lavenderMid,
                            marginTop: spacing.sm,
                          }}>
                          {item.answer}
                        </Text>
                        <Pressable onPress={() => void launch(item.journeyId)} style={{ marginTop: spacing.sm }}>
                          <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.accent }}>Learn more ›</Text>
                        </Pressable>
                      </>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>

          <HomeFooter onLaunchJourney={(id) => void launch(id)} />
        </ScrollView>
      </View>
    </>
  );
}
