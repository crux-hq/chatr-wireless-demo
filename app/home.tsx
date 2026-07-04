import { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MapPin, Plus } from 'lucide-react-native';
import { MarketingHeader } from '@/components/homepage/MarketingHeader';
import { CarouselPopImage } from '@/components/homepage/CarouselPopImage';
import { HomeFooter } from '@/components/homepage/HomeFooter';
import { HomeAccordion } from '@/components/homepage/HomeAccordion';
import { WhyChatrImageBanner } from '@/components/homepage/WhyChatrImageBanner';
import { TestimonialCarousel } from '@/components/homepage/TestimonialCarousel';
import { CtaButton } from '@/components/ui/Button';
import { CarouselControls } from '@/components/ui/CarouselControls';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import {
  HERO_BADGE_KEY,
  HERO_SLIDES,
  PROMO_CARDS,
  HOW_IT_WORKS_STEPS,
  WHY_CHATR_ITEMS,
  COVERAGE_FEATURES,
  HOMEPAGE_FAQ,
} from '@/lib/homepage-data';
import { launchPublicJourney, navigateToPublicPlans } from '@/lib/nav-public';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_WIDTH = Math.min(SCREEN_WIDTH, 480);

const PROMO_ICON_SIZE = 90;
const PROMO_ICON_SHADOW_OFFSET = 10;
const STEPS_CARD_PEEK = spacing.lg;
const STEPS_CARD_GAP = spacing.md;
const STEPS_CARD_WIDTH = SCREEN_WIDTH - spacing.lg * 2 - STEPS_CARD_PEEK;

export default function HomeScreen() {
  const { t } = useTranslation();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [stepsIndex, setStepsIndex] = useState(0);
  const [whyExpanded, setWhyExpanded] = useState<string | null>('affordable');
  const [faqExpanded, setFaqExpanded] = useState<string | null>('roaming');
  const [pageScrollY, setPageScrollY] = useState(0);

  const heroRef = useRef<ScrollView>(null);
  const stepsRef = useRef<ScrollView>(null);

  const launch = (journeyId: string) => {
    setLoadingId(journeyId);
    launchPublicJourney(journeyId);
    setLoadingId(null);
  };

  const updateHeroIndex = (offsetX: number) => {
    const index = Math.max(0, Math.min(HERO_SLIDES.length - 1, Math.round(offsetX / SCREEN_WIDTH)));
    setHeroIndex(index);
  };

  const onHeroScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    updateHeroIndex(e.nativeEvent.contentOffset.x);
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

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, backgroundColor: colors.lavender }}>
        <MarketingHeader onLaunchJourney={(id) => void launch(id)} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={32}
          onScroll={(event) => setPageScrollY(event.nativeEvent.contentOffset.y)}
          contentContainerStyle={{ paddingBottom: 100 }}>
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
                  {t(HERO_BADGE_KEY)}
                </Text>
              </View>
            </View>
            <ScrollView
              ref={heroRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={onHeroScroll}
              onScrollEndDrag={onHeroScroll}
              onMomentumScrollEnd={onHeroScroll}
              style={{ width: SCREEN_WIDTH }}>
              {HERO_SLIDES.map((slide, index) => (
                <View key={slide.id} style={{ width: SCREEN_WIDTH, paddingHorizontal: spacing.lg, paddingTop: spacing.sm }}>
                  <Text
                    style={{
                      fontSize: 32,
                      lineHeight: 40,
                      color: colors.white,
                      textAlign: 'left',
                      marginBottom: spacing.md,
                      fontFamily: fonts.bold,
                    }}>
                    {t(slide.titleKey)}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: 16,
                      lineHeight: 24,
                      color: colors.lavenderMid,
                      textAlign: 'left',
                    }}>
                    {t(slide.subtitleKey)}
                  </Text>
                  <CarouselPopImage
                    source={slide.image}
                    active={heroIndex === index}
                    style={{
                      width: SCREEN_WIDTH - spacing.lg * 2,
                      maxHeight: 244,
                      height: 244,
                      alignSelf: 'center',
                      marginTop: spacing.lg,
                      marginBottom: spacing.lg + 5,
                    }}
                  />
                </View>
              ))}
            </ScrollView>

            <View style={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}>
              <CtaButton
                title={t('homepage.hero.shopNow')}
                size="compact"
                onPress={navigateToPublicPlans}
                style={{ marginBottom: spacing.xs }}
              />
              <CtaButton
                title={t('homepage.hero.viewDetails')}
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
            {PROMO_CARDS.map((card, index) => (
              <ScrollReveal key={card.id} scrollY={pageScrollY} delayMs={index * 40}>
                <View
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
                  {t(card.titleKey)}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 16,
                    color: '#000',
                    lineHeight: 24,
                  }}>
                  {t(card.bodyKey)}
                </Text>
                <View style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
                  <CtaButton
                    title={t(card.ctaKey)}
                    onPress={() => void launch(card.journeyId)}
                    loading={loadingId === card.journeyId}
                  />
                </View>
                </View>
              </ScrollReveal>
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
              {t('homepage.howItWorks.title')}
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
                    {t(step.titleKey)}
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
                    {t(step.bodyKey)}
                  </Text>
                  <View style={{ marginTop: spacing.md, alignSelf: 'stretch' }}>
                    <CtaButton
                      title={t(step.ctaKey)}
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
              {t('homepage.whyChatr.title')}
            </Text>
            <HomeAccordion
              items={WHY_CHATR_ITEMS.map((item) => ({
                id: item.id,
                title: t(item.titleKey),
                body: t(item.bodyKey),
              }))}
              expandedId={whyExpanded}
              onToggle={(id) => setWhyExpanded(whyExpanded === id ? null : id)}
              showThumbsUp
            />
            <WhyChatrImageBanner scrollY={pageScrollY} />
            <CtaButton
              title={t('homepage.whyChatr.getStarted')}
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
                {t('homepage.testimonials.label')}
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
                {t('homepage.testimonials.title')}
              </Text>
              <TestimonialCarousel
                onAllReviews={() => void launch('support')}
                loading={loadingId === 'support'}
              />
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
              {t('homepage.coverage.label')}
            </Text>
            <Text style={{ fontFamily: fonts.semiBold, fontSize: 40, color: colors.white, textAlign: 'left', marginBottom: spacing.lg }}>
              {t('homepage.coverage.title')}
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 16,
                color: colors.lavenderMid,
                textAlign: 'left',
                marginBottom: spacing.lg,
              }}>
              {t('homepage.coverage.subtitle')}
            </Text>
            <View>
              {COVERAGE_FEATURES.map((feature, index) => {
                const Icon = feature.id === 'nationwide' ? MapPin : Plus;
                return (
                <ScrollReveal
                  key={feature.id}
                  scrollY={pageScrollY}
                  direction={index === 0 ? 'left' : 'right'}
                  delayMs={index * 40}>
                <View
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
                        {t(feature.titleKey)}
                      </Text>
                    </View>
                    <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.lavenderMid }}>
                      {t(feature.bodyKey)}
                    </Text>
                  </View>
                </View>
                </ScrollReveal>
              );
              })}
            </View>
            <View style={{ marginTop: 'auto' }}>
              <CtaButton title={t('homepage.coverage.cta')} onPress={() => void launch('coverage')} loading={loadingId === 'coverage'} />
            </View>
            </View>
          </View>

          {/* FAQ */}
          <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.xxl }}>
            <Text style={{ fontFamily: fonts.semiBold, fontSize: 32, lineHeight: 40, color: '#593494', textAlign: 'center' }}>
              {t('homepage.faq.titlePurple')}
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
              {t('homepage.faq.titleBlack')}
            </Text>
            <HomeAccordion
              items={HOMEPAGE_FAQ.map((item) => ({
                id: item.id,
                title: t(item.questionKey),
                body: t(item.answerKey),
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
