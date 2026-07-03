import { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';
import { Header, PageTitle } from '@/components/layout/Header';
import { HomeAccordion } from '@/components/homepage/HomeAccordion';
import { getCategoryById, getFaqsForCategory } from '@/lib/mock/support';
import { useAppStore } from '@/lib/store';
import { launchPublicJourney } from '@/lib/nav-public';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const FAQ_JOURNEY_LINKS: Record<string, string> = {
  'sim-purchase': 'buy-sim',
  'activate-sim': 'activate',
  'payment-cards': 'stores',
  'coverage-map': 'coverage',
  'add-money': 'top-up',
  'autopay-bonus': 'auto-pay',
};

export default function SupportCategoryScreen() {
  const { t } = useTranslation();
  const { category } = useLocalSearchParams<{ category: string }>();
  const locale = useAppStore((s) => s.locale);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categoryData = getCategoryById(category ?? '');
  const faqs = getFaqsForCategory(category ?? '');

  if (!categoryData) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.gray }}>
        <Header />
        <View style={{ padding: spacing.md }}>
          <Text style={{ fontFamily: fonts.semiBold }}>{t('support.categoryNotFound')}</Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: spacing.md }}>
            <Text style={{ color: colors.primary, fontFamily: fonts.bold }}>{t('support.backToSupport')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const title = locale === 'fr' ? categoryData.titleFr : categoryData.titleEn;
  const items = faqs.map((faq) => ({
    id: faq.id,
    title: locale === 'fr' ? faq.questionFr : faq.questionEn,
    body: locale === 'fr' ? faq.answerFr : faq.answerEn,
    journeyId: FAQ_JOURNEY_LINKS[faq.id],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('support.pageTitle')}</PageTitle>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.md }}>
          <ChevronLeft size={20} color={colors.primary} />
          <Text style={{ color: colors.primary, fontFamily: fonts.semiBold }}>
            {t('support.backToSupport')}
          </Text>
        </Pressable>

        <Text style={{ fontFamily: fonts.extraBold, fontSize: 22, marginBottom: spacing.lg }}>{title}</Text>

        <HomeAccordion
          items={items}
          expandedId={expandedId}
          onToggle={(id) => setExpandedId(expandedId === id ? null : id)}
          onLaunchJourney={launchPublicJourney}
        />

        <PublicHomeFooter />
      </ScrollView>
    </View>
  );
}
