import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Plus, Minus } from 'lucide-react-native';
import type { PhoneSpecSection } from '@/lib/mock/types';
import { useAppStore } from '@/lib/store';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export function PhoneSpecs({ sections }: { sections: PhoneSpecSection[] }) {
  const locale = useAppStore((s) => s.locale);
  const [expandedId, setExpandedId] = useState<string | null>(sections[0]?.id ?? null);

  return (
    <View style={{ gap: spacing.sm }}>
      {sections.map((section) => {
        const expanded = expandedId === section.id;
        const title = locale === 'fr' ? section.titleFr : section.titleEn;

        return (
          <Pressable
            key={section.id}
            onPress={() => setExpandedId(expanded ? null : section.id)}
            style={{
              backgroundColor: colors.surfaceElevated,
              borderRadius: radius.md,
              padding: spacing.md,
              borderWidth: 1,
              borderColor: colors.grayMid,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.text, flex: 1 }}>{title}</Text>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: colors.lavenderLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {expanded ? <Minus size={18} color={colors.primary} /> : <Plus size={18} color={colors.primary} />}
              </View>
            </View>
            {expanded
              ? section.rows.map((row, index) => {
                  const label = locale === 'fr' ? row.labelFr : row.labelEn;
                  const value = locale === 'fr' ? row.valueFr : row.valueEn;
                  return (
                    <View
                      key={`${section.id}-${index}`}
                      style={{
                        marginTop: spacing.sm,
                        paddingTop: spacing.sm,
                        borderTopWidth: index === 0 ? 1 : 0,
                        borderTopColor: colors.grayMid,
                      }}>
                      <Text style={{ fontFamily: fonts.semiBold, fontSize: 14, color: colors.textMuted }}>{label}</Text>
                      <Text style={{ fontFamily: fonts.regular, fontSize: 15, color: colors.text, marginTop: 2 }}>
                        {value}
                      </Text>
                    </View>
                  );
                })
              : null}
          </Pressable>
        );
      })}
    </View>
  );
}
