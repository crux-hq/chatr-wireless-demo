import { View, Text, Pressable } from 'react-native';
import { Plus, Minus } from 'lucide-react-native';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type HomeAccordionProps = {
  items: readonly { id: string; title: string; body?: string }[];
  expandedId: string | null;
  onToggle: (id: string) => void;
  variant?: 'light' | 'dark';
};

export function HomeAccordion({ items, expandedId, onToggle, variant = 'light' }: HomeAccordionProps) {
  const isDark = variant === 'dark';

  return (
    <View style={{ gap: spacing.sm }}>
      {items.map((item) => {
        const expanded = expandedId === item.id;
        return (
          <Pressable
            key={item.id}
            onPress={() => onToggle(item.id)}
            style={{
              backgroundColor: expanded && isDark ? colors.primary : colors.white,
              borderRadius: radius.lg,
              padding: spacing.md,
              borderWidth: isDark ? 1 : 0,
              borderColor: colors.primaryLight,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: 16,
                  color: expanded && isDark ? colors.white : colors.text,
                  flex: 1,
                  paddingRight: spacing.sm,
                }}>
                {item.title}
              </Text>
              {expanded ? (
                <Minus size={20} color={expanded && isDark ? colors.white : colors.primary} />
              ) : (
                <Plus size={20} color={colors.primary} />
              )}
            </View>
            {expanded && item.body ? (
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  lineHeight: 22,
                  color: isDark ? colors.lavenderMid : colors.textMuted,
                  marginTop: spacing.sm,
                }}>
                {item.body}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
