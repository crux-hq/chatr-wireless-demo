import { View, Text, Image, type ImageSourcePropType } from 'react-native';
import { Card, Badge, Button } from '@/components/ui/Button';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type SimProductCardProps = {
  name: string;
  tag: string;
  image: ImageSourcePropType;
  priceLabel: string;
  featureIcon: React.ReactNode;
  featureLabel: string;
  ctaTitle: string;
  onPress: () => void;
  loading?: boolean;
};

export function SimProductCard({
  name,
  tag,
  image,
  priceLabel,
  featureIcon,
  featureLabel,
  ctaTitle,
  onPress,
  loading,
}: SimProductCardProps) {
  return (
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
          <Image source={image} style={{ width: 100, height: 100 }} resizeMode="contain" />
          <Badge label={tag} color={colors.primary} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: colors.primary, marginBottom: spacing.xs }}>
            {name}
          </Text>
          <Text style={{ fontFamily: fonts.extraBold, fontSize: 28, color: colors.text, marginBottom: spacing.md }}>
            {priceLabel}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md }}>
            {featureIcon}
            <Text style={{ fontFamily: fonts.semiBold, fontSize: 14, color: colors.primary }}>{featureLabel}</Text>
          </View>
          <Button title={ctaTitle} onPress={onPress} loading={loading} />
        </View>
      </View>
    </Card>
  );
}
