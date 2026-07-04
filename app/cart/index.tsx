import { ScrollView, View, Text, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react-native';
import { Header, PageTitle, PageScrollView } from '@/components/layout/Header';
import { Button, Card } from '@/components/ui/Button';
import { getCartProduct } from '@/lib/mock/cart-products';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/i18n';
import { PublicHomeFooter } from '@/components/layout/PublicHomeFooter';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export default function CartScreen() {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const cart = useAppStore((s) => s.cart);
  const removeFromCart = useAppStore((s) => s.removeFromCart);
  const clearCart = useAppStore((s) => s.clearCart);

  const lineItems = cart
    .map((item) => {
      const product = getCartProduct(item.productId);
      if (!product) return null;
      return { ...item, product };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const subtotal = lineItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    clearCart();
    router.push('/activate');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray }}>
      <Header />
      <PageTitle>{t('cart.title')}</PageTitle>
      <PageScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, paddingBottom: 100 }}>
        {lineItems.length === 0 ? (
          <Card style={{ padding: spacing.lg }}>
            <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, marginBottom: spacing.lg }}>
              {t('cart.empty')}
            </Text>
            <Button title={t('cart.continueShopping')} onPress={() => router.push('/buy-sim')} variant="secondary" />
          </Card>
        ) : (
          <>
            {lineItems.map((item) => {
              const name = locale === 'fr' ? item.product.nameFr : item.product.nameEn;
              const lineTotal = item.product.price * item.quantity;
              return (
                <Card key={item.productId} style={{ padding: spacing.lg, marginBottom: spacing.md }}>
                  <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' }}>
                    <View
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: radius.md,
                        backgroundColor: colors.lavender,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image source={item.product.image} style={{ width: 56, height: 56 }} resizeMode="contain" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.primary }}>{name}</Text>
                      <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, marginTop: 4 }}>
                        {t('cart.quantity', { count: item.quantity })}
                      </Text>
                      <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: colors.text, marginTop: spacing.sm }}>
                        {item.product.price > 0
                          ? formatCurrency(lineTotal, locale)
                          : t('buySim.free')}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => removeFromCart(item.productId)}
                      accessibilityLabel={t('cart.removeItem')}
                      style={{ padding: spacing.xs }}>
                      <Trash2 color={colors.primary} size={20} />
                    </Pressable>
                  </View>
                </Card>
              );
            })}

            <Card style={{ padding: spacing.lg, marginBottom: spacing.lg }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontFamily: fonts.semiBold, fontSize: 18 }}>{t('cart.subtotal')}</Text>
                <Text style={{ fontFamily: fonts.extraBold, fontSize: 24, color: colors.primary }}>
                  {formatCurrency(subtotal, locale)}
                </Text>
              </View>
              <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, marginTop: spacing.xs }}>
                {t('cart.shippingNote')}
              </Text>
            </Card>

            <View style={{ gap: spacing.sm }}>
              <Button title={t('cart.checkout')} onPress={handleCheckout} />
              <Button title={t('cart.continueShopping')} onPress={() => router.push('/buy-sim')} variant="secondary" />
            </View>
          </>
        )}

        <PublicHomeFooter bleedPadding={spacing.lg} />
      </PageScrollView>
    </View>
  );
}
