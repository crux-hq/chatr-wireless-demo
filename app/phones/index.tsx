import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Smartphone, CreditCard } from 'lucide-react-native';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { PageSubtitle } from '@/components/layout/PageSubtitle';
import { Button, Card, SectionTitle } from '@/components/ui/Button';
import { PhoneCard } from '@/components/phones/PhoneCard';
import { HomeAccordion } from '@/components/homepage/HomeAccordion';
import { PHONES, PHONE_FAQ_ITEMS } from '@/lib/mock/phones';
import { startPhysicalSimCheckoutAndNavigate } from '@/lib/nav-public';
import { useAppStore } from '@/lib/store';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function PhonesScreen() {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqItems = PHONE_FAQ_ITEMS.map((item) => ({
    id: item.id,
    title: locale === 'fr' ? item.questionFr : item.questionEn,
    body: locale === 'fr' ? item.answerFr : item.answerEn,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('phones.title')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}>
        <PageSubtitle style={{ marginBottom: spacing.lg }}>{t('phones.subtitle')}</PageSubtitle>

        {PHONES.map((phone) => (
          <PhoneCard key={phone.id} phone={phone} />
        ))}

        <Card style={{ marginTop: spacing.md, marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
            <CreditCard color={colors.primary} size={22} />
            <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.primary }}>
              {t('phones.physicalSim.title')}
            </Text>
          </View>
          <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, marginBottom: spacing.md }}>
            {t('phones.physicalSim.body')}
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
            <Button title={t('phones.physicalSim.buyNow')} onPress={() => startPhysicalSimCheckoutAndNavigate()} />
            <Button title={t('phones.physicalSim.findStore')} variant="secondary" onPress={() => router.push('/stores')} />
          </View>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
            <Smartphone color={colors.primary} size={22} />
            <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.primary }}>{t('phones.esim.title')}</Text>
          </View>
          <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, marginBottom: spacing.md }}>
            {t('phones.esim.body')}
          </Text>
          <Button title={t('phones.esim.shopPlans')} onPress={() => router.push('/plans')} />
        </Card>

        <Pressable
          onPress={() => router.push('/support')}
          style={{
            padding: spacing.lg,
            backgroundColor: colors.lavenderLight,
            borderRadius: radius.lg,
            marginBottom: spacing.xl,
          }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.primary, marginBottom: spacing.xs }}>
            {t('phones.byop.title')}
          </Text>
          <Text style={{ fontFamily: fonts.regular, color: colors.text, marginBottom: spacing.sm }}>
            {t('phones.byop.body')}
          </Text>
          <Text style={{ fontFamily: fonts.semiBold, color: colors.primary }}>{t('phones.byop.cta')} ›</Text>
        </Pressable>

        <SectionTitle>{t('phones.faqTitle')}</SectionTitle>
        <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, marginBottom: spacing.md }}>
          {t('phones.faqNote')}
        </Text>
        <HomeAccordion items={faqItems} expandedId={expandedFaq} onToggle={setExpandedFaq} />

        <PublicHomeFooter />
      </PageScrollView>
    </View>
  );
}
