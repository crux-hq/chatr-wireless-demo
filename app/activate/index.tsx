import { ScrollView, View, Text, Pressable } from 'react-native';
import { router, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react-native';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { Button, Card } from '@/components/ui/Button';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const STEPS = ['step1', 'step2', 'step3', 'step4'] as const;

export default function ActivateIndexScreen() {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('activate.title')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        <Pressable
          onPress={() => router.push('/buy-sim' as Href)}
          style={{
            backgroundColor: colors.lavenderMid,
            borderRadius: radius.md,
            padding: spacing.md,
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: colors.grayMid,
          }}>
          <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.textMuted, marginBottom: 4 }}>
            {t('activate.needSim')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.primary, flex: 1 }}>
              {t('activate.buySimCta')}
            </Text>
            <ChevronRight color={colors.primary} size={20} />
          </View>
        </Pressable>

        {STEPS.map((step, i) => {
          const isOrderStep = step === 'step1';
          const content = (
            <Card style={{ marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: colors.green,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{ color: colors.white, fontFamily: fonts.extraBold }}>{i + 1}</Text>
              </View>
              <Text style={{ fontFamily: fonts.semiBold, flex: 1 }}>{t(`activate.${step}`)}</Text>
              {isOrderStep ? <ChevronRight color={colors.primary} size={20} /> : null}
            </Card>
          );

          if (isOrderStep) {
            return (
              <Pressable key={step} onPress={() => router.push('/buy-sim' as Href)}>
                {content}
              </Pressable>
            );
          }

          return <View key={step}>{content}</View>;
        })}
        <View style={{ marginTop: spacing.xl }}>
          <Button title={t('common.continue')} onPress={() => router.push('/activate/sim')} />
        </View>
        <PublicHomeFooter bleedPadding={spacing.lg} />
      </PageScrollView>
    </View>
  );
}
