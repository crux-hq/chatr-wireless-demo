import { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Header, PromoBanner } from '@/components/layout/Header';
import { PlanCard, PlanFilter } from '@/components/plans/PlanCard';
import { Card, SectionTitle } from '@/components/ui/Button';
import { PLANS } from '@/lib/mock/plans';
import { FAQ_ITEMS } from '@/lib/mock/stores';
import { useAppStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme/colors';

export default function PlansScreen() {
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
      <Header title={t('plans.title')} />
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <PromoBanner title={t('plans.nationWide')} subtitle={t('plans.subtitle')} />
        <PlanFilter value={filter} onChange={setFilter} options={filterOptions} />
        {filtered.map((plan) => (
          <PlanCard key={plan.id} plan={plan} isCurrent={user?.planId === plan.id} />
        ))}

        <SectionTitle>{t('plans.faq')}</SectionTitle>
        {FAQ_ITEMS.slice(0, 4).map((faq) => (
          <Card key={faq.id} style={{ marginBottom: spacing.sm }}>
            <Text
              onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              style={{ fontWeight: '700' }}>
              {locale === 'fr' ? faq.questionFr : faq.questionEn}
            </Text>
            {expandedFaq === faq.id ? (
              <Text style={{ color: colors.grayDark, marginTop: 8 }}>
                {locale === 'fr' ? faq.answerFr : faq.answerEn}
              </Text>
            ) : null}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
