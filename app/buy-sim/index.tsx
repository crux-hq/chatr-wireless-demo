import { useState } from 'react';
import { ScrollView, View, Text, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Truck, MapPin } from 'lucide-react-native';
import { Header, PageTitle } from '@/components/layout/Header';
import { PageSubtitle } from '@/components/layout/PageSubtitle';
import { Button, Card, Badge } from '@/components/ui/Button';
import { SimOrderSuccessDialog } from '@/components/sim/SimOrderSuccessDialog';
import { SIM_PRODUCT } from '@/lib/mock/sim-product';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/i18n';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function BuySimScreen() {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const [successVisible, setSuccessVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const productName = locale === 'fr' ? SIM_PRODUCT.nameFr : SIM_PRODUCT.nameEn;
  const productTag = locale === 'fr' ? SIM_PRODUCT.tagFr : SIM_PRODUCT.tagEn;

  const handleAddToCart = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
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
      />
      <Header />
      <PageTitle>{t('buySim.title')}</PageTitle>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, paddingBottom: 100 }}>
        <PageSubtitle style={{ marginBottom: spacing.lg }}>
          {t('buySim.subtitlePrefix')}{' '}
          <Text style={{ fontFamily: fonts.bold, color: colors.primary }}>{productName}</Text>{' '}
          {t('buySim.subtitleSuffix')}
        </PageSubtitle>

        <Card style={{ padding: spacing.lg }}>
          <View style={{ flexDirection: 'row', gap: spacing.lg, alignItems: 'flex-start' }}>
            <View
              style={{
                width: 120,
                height: 150,
                borderRadius: radius.md,
                backgroundColor: colors.lavender,
                alignItems: 'center',
                justifyContent: 'center',
                padding: spacing.sm,
              }}>
              <Image
                source={SIM_PRODUCT.image}
                style={{ width: 100, height: 100 }}
                resizeMode="contain"
              />
              <Badge label={productTag} color={colors.primary} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: colors.primary, marginBottom: spacing.xs }}>
                {productName}
              </Text>
              <Text style={{ fontFamily: fonts.extraBold, fontSize: 28, color: colors.text, marginBottom: spacing.md }}>
                {formatCurrency(SIM_PRODUCT.price, locale)}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md }}>
                <Truck color={colors.primary} size={16} />
                <Text style={{ fontFamily: fonts.semiBold, fontSize: 14, color: colors.primary }}>
                  {t('buySim.freeShipping')}
                </Text>
              </View>
              <Button title={t('buySim.addToCart')} onPress={() => void handleAddToCart()} loading={loading} />
            </View>
          </View>
        </Card>

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
        <PublicHomeFooter bleedPadding={spacing.lg} />
      </ScrollView>
    </View>
  );
}
