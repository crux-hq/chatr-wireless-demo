import { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/layout/Header';
import { PlanCard, PlanFilter } from '@/components/plans/PlanCard';
import { PlansIntro } from '@/components/plans/PlansIntro';
import { ProvincePlansBar } from '@/components/plans/ProvincePlansBar';
import { Card, SectionTitle } from '@/components/ui/Button';
import { PLANS } from '@/lib/mock/plans';
import { FAQ_ITEMS } from '@/lib/mock/stores';
import { useAppStore } from '@/lib/store';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts, typography } from '@/lib/theme/typography';

type PlansBrowseProps = {
  variant: 'authenticated' | 'public';
};

export function PlansBrowse({ variant }: PlansBrowseProps) {
  const { t } = useTranslation();
  const user = useAppStore((s) => s.user);
  const locale = useAppStore((s) => s.locale);
  const [filter, setFilter] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const filtered = PLANS.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'talk-text-data') return p.category === 'talk-text-data';
    return p.category === 'talk-text';
  });

  const filterOptions = [
    { key: 'all', label: t('plans.filterAll') },
    { key: 'talk-text-data', label: t('plans.filterData') },
    { key: 'talk-text', label: t('plans.filterTalk') },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: variant === 'public' ? 100 : spacing.md,
        }}>
        <Text
          style={{
            ...typography.pageTitle,
            marginTop: spacing.xl,
            marginBottom: spacing.lg,
            paddingHorizontal: spacing.lg,
          }}>
          {t('plans.title')}
        </Text>
        <PlansIntro />
        <View style={{ paddingHorizontal: spacing.md }}>
        <ProvincePlansBar />
        <PlanFilter value={filter} onChange={setFilter} options={filterOptions} />
        {filtered.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrent={variant === 'authenticated' && user?.planId === plan.id}
            showBuyActions={variant === 'public'}
          />
        ))}

        <SectionTitle>{t('plans.faq')}</SectionTitle>
        {FAQ_ITEMS.slice(0, 4).map((faq) => (
          <Card key={faq.id} style={{ marginBottom: spacing.sm }}>
            <Text
              onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              style={{ fontFamily: fonts.bold }}>
              {locale === 'fr' ? faq.questionFr : faq.questionEn}
            </Text>
            {expandedFaq === faq.id ? (
              <Text style={{ fontFamily: fonts.regular, color: colors.grayDark, marginTop: 8 }}>
                {locale === 'fr' ? faq.answerFr : faq.answerEn}
              </Text>
            ) : null}
          </Card>
        ))}

        {variant === 'public' ? <PublicHomeFooter /> : null}
        </View>
      </ScrollView>
    </View>
  );
}
