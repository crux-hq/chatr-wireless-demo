import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { PLAN_VALUE_PROPS } from '@/lib/plans-page-data';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const COLLAPSED_HEIGHT = 56;

export function PlansIntro() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Pressable
        onPress={() => setExpanded((value) => !value)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}>
        <View style={{ position: 'relative' }}>
          <View style={expanded ? undefined : { maxHeight: COLLAPSED_HEIGHT, overflow: 'hidden' }}>
            <Text style={{ fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, color: colors.text }}>
              {t('plans.intro.lead')}
            </Text>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 16,
                lineHeight: 24,
                color: colors.text,
                marginTop: spacing.sm,
              }}>
              {t('plans.intro.deal')}
            </Text>
            {expanded ? (
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  lineHeight: 20,
                  color: colors.textMuted,
                  marginTop: spacing.sm,
                }}>
                {t('plans.intro.disclaimer')}
              </Text>
            ) : null}
          </View>
          {!expanded ? (
            <LinearGradient
              colors={['rgba(245, 243, 255, 0)', colors.gray]}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 32,
              }}
              pointerEvents="none"
            />
          ) : null}
        </View>
        <Text style={{ fontFamily: fonts.semiBold, fontSize: 14, color: colors.primary, marginTop: spacing.sm }}>
          {expanded ? t('plans.intro.tapToCollapse') : t('plans.intro.tapToExpand')}
        </Text>
      </Pressable>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.lg }}>
        {PLAN_VALUE_PROPS.map((item) => {
          const Icon = item.icon;
          return (
            <View key={item.id} style={{ width: 108, alignItems: 'center' }}>
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: radius.lg,
                  backgroundColor: colors.lavenderLight,
                  borderWidth: 1,
                  borderColor: colors.lavender,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {'custom' in item && item.custom ? (
                  <Icon size={32} />
                ) : (
                  <Icon color={colors.primary} size={32} strokeWidth={1.5} />
                )}
              </View>
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: 13,
                  lineHeight: 18,
                  color: colors.text,
                  textAlign: 'center',
                  marginTop: spacing.sm,
                }}>
                {t(item.labelKey)}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
