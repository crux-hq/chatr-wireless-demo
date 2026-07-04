import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { PLAN_VALUE_PROPS } from '@/lib/plans-page-data';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const COLLAPSED_HEIGHT = 56;
const VALUE_PROP_GAP = spacing.md;
const VALUE_PROP_PADDING = spacing.lg;
const VALUE_PROP_PEEK = 44;
const VISIBLE_VALUE_PROPS = 3;

function getValuePropItemWidth(screenWidth: number) {
  return Math.floor(
    (screenWidth - VALUE_PROP_PADDING - VISIBLE_VALUE_PROPS * VALUE_PROP_GAP - VALUE_PROP_PEEK) /
      VISIBLE_VALUE_PROPS,
  );
}

export function PlansIntro() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const itemWidth = getValuePropItemWidth(Dimensions.get('window').width);

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
        decelerationRate="fast"
        contentContainerStyle={{
          paddingLeft: VALUE_PROP_PADDING,
          paddingRight: VALUE_PROP_PADDING,
          gap: VALUE_PROP_GAP,
        }}>
        {PLAN_VALUE_PROPS.map((item) => {
          const Icon = item.icon;
          return (
            <View key={item.id} style={{ width: itemWidth, alignItems: 'center' }}>
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
