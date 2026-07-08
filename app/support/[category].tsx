import { useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, Redirect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { BackToSupport } from '@/components/support/BackToSupport';
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
        <PageTitle leading={<BackToSupport />}>{t('support.pageTitle')}</PageTitle>
        <PageScrollView contentContainerStyle={{ padding: spacing.md }}>
          <Text style={{ fontFamily: fonts.semiBold }}>{t('support.categoryNotFound')}</Text>
        </PageScrollView>
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


  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  if (isAuthenticated) {
    return <Redirect href={`/(tabs)/support/${category}`} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle leading={<BackToSupport />}>{t('support.pageTitle')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}>
        <Text style={{ fontFamily: fonts.extraBold, fontSize: 22, marginBottom: spacing.lg }}>{title}</Text>

        <HomeAccordion
          items={items}
          expandedId={expandedId}
          onToggle={(id) => setExpandedId(expandedId === id ? null : id)}
          onLaunchJourney={launchPublicJourney}
        />

        <PublicHomeFooter />
      </PageScrollView>
    </View>
  );
}
