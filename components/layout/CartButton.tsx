import { Pressable, View, Text } from 'react-native';
import { router, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ShoppingCart } from 'lucide-react-native';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export function CartButton() {
  const { t } = useTranslation();
  const itemCount = useAppStore((s) => s.cart.reduce((total, item) => total + item.quantity, 0));

  if (itemCount === 0) return null;

  return (
    <Pressable
      onPress={() => router.push('/cart' as Href)}
      accessibilityLabel={t('cart.openCart', { count: itemCount })}
      style={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View>
        <ShoppingCart color={colors.primary} size={24} />
        <View
          style={{
            position: 'absolute',
            top: -6,
            right: -8,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: colors.accent,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 4,
          }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: colors.textOnAccent }}>{itemCount}</Text>
        </View>
      </View>
    </Pressable>
  );
}
