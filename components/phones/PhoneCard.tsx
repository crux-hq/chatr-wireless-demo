import { View, Text, Pressable } from 'react-native';
import { router, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { PhoneImage } from '@/components/phones/PhoneImage';
import type { Phone } from '@/lib/mock/types';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/i18n';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export function PhoneCard({ phone }: { phone: Phone }) {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);
  const name = locale === 'fr' ? phone.nameFr : phone.nameEn;

  return (
    <Pressable
      onPress={() => router.push(`/phones/${phone.id}` as Href)}
      style={{
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius.lg,
        marginBottom: spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.grayMid,
      }}>
      <PhoneImage phone={phone} height={180} />

      <View style={{ padding: spacing.lg }}>
        <Text style={{ fontFamily: fonts.semiBold, fontSize: 20, color: colors.text }}>{name}</Text>
        <Text style={{ fontFamily: fonts.extraBold, fontSize: 24, color: colors.primary, marginTop: spacing.xs }}>
          {formatCurrency(phone.price, locale)}
        </Text>
      </View>
    </Pressable>
  );
}
