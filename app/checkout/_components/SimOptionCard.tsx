import { Pressable, View, Text } from 'react-native';
import { Badge } from '@/components/ui/Button';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type SimOptionCardProps = {
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  badge?: string;
  extra?: React.ReactNode;
};

export function SimOptionCard({ title, description, selected, onPress, icon, badge, extra }: SimOptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: 2,
        borderColor: selected ? colors.primary : colors.grayMid,
        borderRadius: radius.lg,
        backgroundColor: selected ? colors.lavenderLight : colors.surfaceElevated,
        padding: spacing.lg,
        marginBottom: spacing.md,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 2,
            borderColor: selected ? colors.primary : colors.grayMid,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 2,
          }}>
          {selected ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary }} /> : null}
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap', marginBottom: 4 }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.text }}>{title}</Text>
            {badge ? <Badge label={badge} color={colors.accent} /> : null}
          </View>
          <Text style={{ fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted, lineHeight: 22 }}>{description}</Text>
          {extra ? <View style={{ marginTop: spacing.sm }}>{extra}</View> : null}
        </View>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.md,
            backgroundColor: colors.lavender,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {icon}
        </View>
      </View>
    </Pressable>
  );
}
