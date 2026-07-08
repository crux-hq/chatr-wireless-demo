import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts, typography } from '@/lib/theme/typography';

function Swatch({ name, value, textColor = colors.text }: { name: string; value: string; textColor?: string }) {
  return (
    <View style={{ flex: 1, minWidth: 140 }}>
      <View
        style={{
          height: 72,
          borderRadius: radius.md,
          backgroundColor: value,
          borderWidth: 1,
          borderColor: colors.grayMid,
          marginBottom: spacing.xs,
        }}
      />
      <Text style={{ fontFamily: fonts.semiBold, fontSize: 14, color: colors.text }}>{name}</Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted }}>{value}</Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: textColor }}>Aa</Text>
    </View>
  );
}

const meta = {
  title: 'Design System/Overview',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;

export const Colors: StoryObj = {
  render: () => (
    <View style={{ gap: spacing.lg }}>
      <Text style={{ ...typography.h1 }}>Brand colors</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
        <Swatch name="Primary" value={colors.primary} textColor={colors.textOnPrimary} />
        <Swatch name="Primary dark" value={colors.primaryDark} textColor={colors.textOnPrimary} />
        <Swatch name="Accent" value={colors.accent} />
        <Swatch name="Surface" value={colors.surface} />
        <Swatch name="Lavender" value={colors.lavenderLight} />
        <Swatch name="Text" value={colors.text} textColor={colors.white} />
        <Swatch name="Text muted" value={colors.textMuted} textColor={colors.white} />
        <Swatch name="Error" value={colors.red} textColor={colors.white} />
      </View>
    </View>
  ),
};

export const Typography: StoryObj = {
  render: () => (
    <View style={{ gap: spacing.md }}>
      <Text style={{ fontFamily: fonts.extraBold, fontSize: 32 }}>Santral ExtraBold 32</Text>
      <Text style={{ fontFamily: fonts.bold, fontSize: 24 }}>Santral Bold 24</Text>
      <Text style={{ fontFamily: fonts.semiBold, fontSize: 20 }}>Santral SemiBold 20</Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 16, lineHeight: 24 }}>
        Santral Regular 16 — body copy for plans, checkout, and account screens.
      </Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted }}>
        Muted supporting text for descriptions and helper copy.
      </Text>
    </View>
  ),
};

export const Spacing: StoryObj = {
  render: () => (
    <View style={{ gap: spacing.sm }}>
      {Object.entries(spacing).map(([name, value]) => (
        <View key={name} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <Text style={{ width: 48, fontFamily: fonts.semiBold }}>{name}</Text>
          <View style={{ width: value, height: 16, backgroundColor: colors.primary, borderRadius: 4 }} />
          <Text style={{ fontFamily: fonts.regular, color: colors.textMuted }}>{value}px</Text>
        </View>
      ))}
    </View>
  ),
};
