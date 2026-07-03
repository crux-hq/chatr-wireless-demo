import { View, Text, Pressable } from 'react-native';
import { Plus, Minus, ThumbsUp } from 'lucide-react-native';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type HomeAccordionItem = {
  id: string;
  title: string;
  body?: string;
  journeyId?: string;
};

type HomeAccordionProps = {
  items: readonly HomeAccordionItem[];
  expandedId: string | null;
  onToggle: (id: string) => void;
  variant?: 'light' | 'dark';
  showThumbsUp?: boolean;
  onLaunchJourney?: (journeyId: string) => void;
};

export function HomeAccordion({
  items,
  expandedId,
  onToggle,
  variant = 'light',
  showThumbsUp = false,
  onLaunchJourney,
}: HomeAccordionProps) {
  const isDark = variant === 'dark';

  return (
    <View style={{ gap: spacing.lg }}>
      {items.map((item) => {
        const expanded = expandedId === item.id;
        return (
          <Pressable
            key={item.id}
            onPress={() => onToggle(item.id)}
            style={{
              backgroundColor: expanded ? '#593494' : colors.white,
              borderRadius: radius.lg,
              padding: spacing.md,
              borderWidth: isDark ? 1 : 0,
              borderColor: colors.primaryLight,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              {showThumbsUp ? (
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radius.sm,
                    backgroundColor: colors.lavenderLight,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: spacing.md,
                  }}>
                  <ThumbsUp size={22} color={colors.primary} />
                </View>
              ) : null}
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: 24,
                  lineHeight: 30,
                  color: expanded ? colors.white : colors.text,
                  flex: 1,
                  paddingRight: spacing.sm,
                }}>
                {item.title}
              </Text>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#F6F3FB',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {expanded ? (
                  <Minus size={20} color="#593494" />
                ) : (
                  <Plus size={20} color={colors.primary} />
                )}
              </View>
            </View>
            {expanded && item.body ? (
              <>
                <View
                  style={{
                    height: 1,
                    backgroundColor: 'rgba(217, 217, 217, 0.24)',
                    marginTop: spacing.md,
                    marginBottom: spacing.md,
                    marginHorizontal: -spacing.md,
                    alignSelf: 'stretch',
                  }}
                />
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 16,
                    lineHeight: 24,
                    color: colors.white,
                  }}>
                  {item.body}
                </Text>
                {item.journeyId && onLaunchJourney ? (
                  <Pressable onPress={() => onLaunchJourney(item.journeyId!)} style={{ marginTop: spacing.sm }}>
                    <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.accent }}>Learn more ›</Text>
                  </Pressable>
                ) : null}
              </>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
