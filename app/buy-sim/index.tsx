import { useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Truck, MapPin, Zap } from 'lucide-react-native';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { PageSubtitle } from '@/components/layout/PageSubtitle';
import { SimOrderSuccessDialog } from '@/components/sim/SimOrderSuccessDialog';
import { SimProductCard } from '@/components/sim/SimProductCard';
import { Toast } from '@/components/ui/Toast';
import { ESIM_PRODUCT, SIM_PRODUCT } from '@/lib/mock/sim-product';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/i18n';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts, typography } from '@/lib/theme/typography';

export default function BuySimScreen() {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const addToCart = useAppStore((s) => s.addToCart);
  const [successVisible, setSuccessVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [compatibilityToastVisible, setCompatibilityToastVisible] = useState(false);

  const productName = locale === 'fr' ? SIM_PRODUCT.nameFr : SIM_PRODUCT.nameEn;
  const productTag = locale === 'fr' ? SIM_PRODUCT.tagFr : SIM_PRODUCT.tagEn;
  const esimName = locale === 'fr' ? ESIM_PRODUCT.nameFr : ESIM_PRODUCT.nameEn;
  const esimTag = locale === 'fr' ? ESIM_PRODUCT.tagFr : ESIM_PRODUCT.tagEn;

  const handleAddToCart = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    addToCart(SIM_PRODUCT.id);
    setLoading(false);
    setSuccessVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <SimOrderSuccessDialog
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
        onActivate={() => {
          setSuccessVisible(false);
          router.push('/activate');
        }}
        onBrowsePlans={() => {
          setSuccessVisible(false);
          router.push('/plans');
        }}
        onViewCart={() => {
          setSuccessVisible(false);
          router.push('/cart');
        }}
      />
      <Header />
      <PageTitle>{t('buySim.title')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, paddingBottom: 100 }}>
        <PageSubtitle style={{ marginBottom: spacing.lg }}>
          {t('buySim.subtitlePrefix')}{' '}
          <Text style={{ fontFamily: fonts.bold, color: colors.primary }}>{productName}</Text>{' '}
          {t('buySim.subtitleSuffix')}
        </PageSubtitle>

        <SimProductCard
          name={productName}
          tag={productTag}
          image={SIM_PRODUCT.image}
          priceLabel={formatCurrency(SIM_PRODUCT.price, locale)}
          featureIcon={<Truck color={colors.primary} size={16} />}
          featureLabel={t('buySim.freeShipping')}
          ctaTitle={t('buySim.addToCart')}
          onPress={() => void handleAddToCart()}
          loading={loading}
        />

        <Pressable
          onPress={() => router.push('/stores')}
          style={{
            marginTop: spacing.lg,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            padding: spacing.md,
            backgroundColor: colors.surfaceElevated,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.grayMid,
          }}>
          <MapPin color={colors.primary} size={20} />
          <Text style={{ fontFamily: fonts.semiBold, fontSize: 16, color: colors.primary, flex: 1 }}>
            {t('buySim.findStore')}
          </Text>
        </Pressable>

        <Text
          style={{
            ...typography.pageTitle,
            marginTop: spacing.xxl,
            marginBottom: spacing.lg,
          }}>
          {t('buySim.esimTitle')}
        </Text>
        <PageSubtitle style={{ marginBottom: spacing.sm }}>{t('buySim.esimSubtitle')}</PageSubtitle>
        <Pressable
          onPress={() => setCompatibilityToastVisible(true)}
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
            alignSelf: 'flex-start',
            marginBottom: spacing.lg,
          })}>
          <Text
            style={{
              fontFamily: fonts.semiBold,
              fontSize: 14,
              color: colors.accent,
              textDecorationLine: 'underline',
            }}>
            {t('checkout.checkCompatibility')}
          </Text>
        </Pressable>

        <SimProductCard
          name={esimName}
          tag={esimTag}
          image={ESIM_PRODUCT.image}
          priceLabel={t('buySim.free')}
          featureIcon={<Zap color={colors.primary} size={16} />}
          featureLabel={t('buySim.instantAccess')}
          ctaTitle={t('buySim.shopPlans')}
          onPress={() => router.push('/plans')}
        />

        <PublicHomeFooter bleedPadding={spacing.lg} />
      </PageScrollView>
      <Toast
        message={t('checkout.phoneCompatible')}
        visible={compatibilityToastVisible}
        onHide={() => setCompatibilityToastVisible(false)}
      />
    </View>
  );
}
