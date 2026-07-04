import { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { router, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { Button, Card, CtaButton } from '@/components/ui/Button';
import { SupportCategoryCard } from '@/components/support/SupportCategoryCard';
import { SubmitTicketDialog } from '@/components/support/SubmitTicketDialog';
import { HomeAccordion } from '@/components/homepage/HomeAccordion';
import { SUPPORT_CATEGORIES, SUPPORT_FAQS, FEATURED_FAQ_IDS } from '@/lib/mock/support';
import { launchPublicJourney } from '@/lib/nav-public';
import { useAppStore } from '@/lib/store';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function SupportScreen() {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const [ticketVisible, setTicketVisible] = useState(false);
  const [featuredExpanded, setFeaturedExpanded] = useState<string | null>(null);

  const featuredItems = FEATURED_FAQ_IDS.map((id) => {
    const faq = SUPPORT_FAQS[id];
    return {
      id,
      title: locale === 'fr' ? faq.questionFr : faq.questionEn,
      body: locale === 'fr' ? faq.answerFr : faq.answerEn,
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <SubmitTicketDialog visible={ticketVisible} onClose={() => setTicketVisible(false)} />
      <Header />
      <PageTitle>{t('support.pageTitle')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}>
        <Text style={{ fontFamily: fonts.extraBold, fontSize: 20, marginBottom: spacing.md }}>
          {t('support.browseByCategory')}
        </Text>

        <Card style={{ marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.grayMid }}>
          <Text style={{ fontFamily: fonts.semiBold, fontSize: 16, lineHeight: 24, marginBottom: spacing.md }}>
            {t('support.featuredBanner')}
          </Text>
          <Button
            title={t('support.findAnswers')}
            onPress={() => setFeaturedExpanded(featuredExpanded ? null : FEATURED_FAQ_IDS[0])}
            variant="secondary"
            size="compact"
          />
          {featuredExpanded ? (
            <View style={{ marginTop: spacing.md }}>
              <HomeAccordion
                items={featuredItems}
                expandedId={featuredExpanded}
                onToggle={(id) => setFeaturedExpanded(featuredExpanded === id ? null : id)}
              />
            </View>
          ) : null}
        </Card>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: spacing.md,
            marginBottom: spacing.xl,
          }}>
          {SUPPORT_CATEGORIES.map((category) => (
            <SupportCategoryCard
              key={category.id}
              id={category.id}
              title={locale === 'fr' ? category.titleFr : category.titleEn}
              onPress={() => router.push(`/support/${category.id}` as Href)}
            />
          ))}
        </View>

        <Card style={{ marginBottom: spacing.lg, backgroundColor: colors.lavender }}>
          <Text style={{ fontFamily: fonts.extraBold, fontSize: 18, marginBottom: spacing.sm }}>
            {t('support.autoPayTitle')}
          </Text>
          <Text style={{ color: colors.grayDark, lineHeight: 22, marginBottom: spacing.md }}>
            {t('support.autoPayBody')}
          </Text>
          <CtaButton
            title={t('support.autoPayCta')}
            onPress={() => launchPublicJourney('auto-pay')}
            size="compact"
          />
        </Card>

        <Card
          style={{
            marginBottom: spacing.lg,
            backgroundColor: colors.primary,
            borderWidth: 0,
          }}>
          <Text
            style={{
              fontFamily: fonts.extraBold,
              fontSize: 18,
              color: colors.white,
              marginBottom: spacing.sm,
            }}>
            {t('support.stillNeedHelp')}
          </Text>
          <Text style={{ color: colors.white, opacity: 0.9, lineHeight: 22, marginBottom: spacing.md }}>
            {t('support.stillNeedHelpBody')}
          </Text>
          <Pressable onPress={() => setTicketVisible(true)}>
            <View
              style={{
                alignSelf: 'flex-start',
                backgroundColor: colors.accent,
                borderRadius: radius.button,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm + 4,
              }}>
              <Text style={{ fontFamily: fonts.bold, color: colors.textOnAccent }}>
                {t('support.submitTicket')} ›
              </Text>
            </View>
          </Pressable>
        </Card>

        <PublicHomeFooter />
      </PageScrollView>
    </View>
  );
}
