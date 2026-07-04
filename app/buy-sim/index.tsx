import { Image, Pressable, View, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Package, Smartphone } from 'lucide-react-native';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { PageSubtitle } from '@/components/layout/PageSubtitle';
import { Button, Badge, Card } from '@/components/ui/Button';
import { ESIM_PRODUCT, SIM_PRODUCT } from '@/lib/mock/sim-product';
import { startPhysicalSimCheckoutAndNavigate } from '@/lib/nav-public';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/i18n';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function BuySimScreen() {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const simName = locale === 'fr' ? SIM_PRODUCT.nameFr : SIM_PRODUCT.nameEn;
  const simTag = locale === 'fr' ? SIM_PRODUCT.tagFr : SIM_PRODUCT.tagEn;
  const esimName = locale === 'fr' ? ESIM_PRODUCT.nameFr : ESIM_PRODUCT.nameEn;
  const esimTag = locale === 'fr' ? ESIM_PRODUCT.tagFr : ESIM_PRODUCT.tagEn;

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('buySim.title')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, paddingBottom: 100 }}>
        <PageSubtitle style={{ marginBottom: spacing.lg }}>
          {t('buySim.landingSubtitle')}
        </PageSubtitle>

        <Card style={{ marginBottom: spacing.md, padding: spacing.lg }}>
          <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md }}>
            <Image source={SIM_PRODUCT.image} style={{ width: 72, height: 72, borderRadius: radius.md }} resizeMode="contain" />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap', marginBottom: spacing.xs }}>
                <Package color={colors.primary} size={20} />
                <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.primary }}>{simName}</Text>
                <Badge label={simTag} color={colors.primary} />
              </View>
              <Text style={{ fontFamily: fonts.extraBold, fontSize: 24, color: colors.text }}>
                {formatCurrency(SIM_PRODUCT.price, locale)}
              </Text>
              <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, marginTop: spacing.xs }}>
                {t('buySim.freeShipping')}
              </Text>
            </View>
          </View>
          <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, lineHeight: 22, marginBottom: spacing.md }}>
            {t('buySim.subtitlePrefix')}{' '}
            <Text style={{ fontFamily: fonts.semiBold, color: colors.text }}>{t('buySim.productName')}</Text>{' '}
            {t('buySim.subtitleSuffix')}
          </Text>
          <Button title={t('buySim.addToCart')} onPress={() => startPhysicalSimCheckoutAndNavigate()} />
        </Card>

        <Card style={{ marginBottom: spacing.md, padding: spacing.lg }}>
          <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md }}>
            <Image source={ESIM_PRODUCT.image} style={{ width: 72, height: 72, borderRadius: radius.md }} resizeMode="contain" />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap', marginBottom: spacing.xs }}>
                <Smartphone color={colors.primary} size={20} />
                <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.primary }}>{t('buySim.esimTitle')}</Text>
                <Badge label={esimTag} color={colors.accent} />
              </View>
              <Text style={{ fontFamily: fonts.extraBold, fontSize: 24, color: colors.text }}>{t('buySim.free')}</Text>
              <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, marginTop: spacing.xs }}>
                {t('buySim.instantAccess')}
              </Text>
            </View>
          </View>
          <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, lineHeight: 22, marginBottom: spacing.md }}>
            {t('buySim.esimSubtitle')}
          </Text>
          <Button title={t('buySim.shopPlans')} onPress={() => router.push('/plans')} variant="secondary" />
        </Card>

        <Pressable onPress={() => router.push('/stores')} style={{ alignItems: 'center', marginTop: spacing.sm }}>
          <Text style={{ fontFamily: fonts.semiBold, color: colors.primary, textDecorationLine: 'underline' }}>
            {t('buySim.findStore')}
          </Text>
        </Pressable>

        <PublicHomeFooter bleedPadding={spacing.lg} />
      </PageScrollView>
    </View>
  );
}
