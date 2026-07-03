import { Pressable, View, Text } from 'react-native';
import type { SupportCategoryId } from '@/lib/mock/support';
import { CATEGORY_ICONS } from '@/lib/mock/support';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type SupportCategoryCardProps = {
  id: SupportCategoryId;
  title: string;
  onPress: () => void;
};

export function SupportCategoryCard({ id, title, onPress }: SupportCategoryCardProps) {
  const Icon = CATEGORY_ICONS[id];

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: '48%',
        backgroundColor: colors.white,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.grayMid,
        padding: spacing.lg,
        minHeight: 140,
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: radius.sm,
          backgroundColor: colors.lavender,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.md,
        }}>
        <Icon size={24} color={colors.primary} strokeWidth={1.75} />
      </View>
      <Text
        style={{
          fontFamily: fonts.semiBold,
          fontSize: 15,
          lineHeight: 20,
          color: colors.text,
        }}>
        {title}
      </Text>
    </Pressable>
  );
}
