import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/lib/store';
import { AppHeaderBar } from '@/components/layout/AppHeaderBar';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export { LanguageToggle } from '@/components/layout/LanguageToggle';
export { PageTitle } from '@/components/layout/PageTitle';
export { PageScrollView } from '@/components/layout/PageScrollView';

function getUserInitials(firstName: string, lastName: string) {
  const first = firstName.trim()[0] ?? '';
  const last = lastName.trim()[0] ?? '';
  return (first + last).toUpperCase() || '?';
}

export function Header() {
  const { t } = useTranslation();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const user = useAppStore((s) => s.user);
  const initials = user ? getUserInitials(user.firstName, user.lastName) : '?';

  return (
    <AppHeaderBar
      trailing={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <LanguageToggle onDark={false} />
          {isAuthenticated && user ? (
            <Pressable
              onPress={() => router.push('/(tabs)/profile')}
              accessibilityLabel={t('more.profile')}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.lavender,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.primary }}>{initials}</Text>
            </Pressable>
          ) : null}
        </View>
      }
    />
  );
}

export function PromoBanner({
  title,
  subtitle,
  ctaTitle,
  onCta,
  onClaimBonus,
  bonusClaimed = false,
}: {
  title: string;
  subtitle: string;
  ctaTitle?: string;
  onCta?: () => void;
  onClaimBonus?: () => void;
  bonusClaimed?: boolean;
}) {
  const { t } = useTranslation();
  const handleCta = onCta ?? onClaimBonus;
  const showCta = Boolean(handleCta && !bonusClaimed);
  const label = ctaTitle ?? t('plans.autoPayBonus');

  const pill = (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: colors.accent,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs + 2,
        borderRadius: radius.pill,
      }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: colors.textOnAccent }}>
        {label}
      </Text>
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: colors.primaryDark,
        padding: spacing.lg,
        borderRadius: radius.lg,
        marginBottom: spacing.lg,
      }}>
      <Text
        style={{
          fontFamily: fonts.bold,
          fontSize: 18,
          color: colors.white,
          lineHeight: 24,
        }}>
        {title}
      </Text>
      <Text
        style={{
          color: colors.white,
          marginTop: spacing.sm,
          opacity: 0.88,
          fontFamily: fonts.regular,
          fontSize: 16,
          lineHeight: 24,
        }}>
        {subtitle}
      </Text>
      {showCta ? (
        <Pressable
          onPress={handleCta}
          style={({ pressed }) => ({ marginTop: spacing.md, opacity: pressed ? 0.85 : 1 })}>
          {pill}
        </Pressable>
      ) : null}
    </View>
  );
}

export function QuickLinkGrid({
  items,
}: {
  items: { label: string; onPress: () => void; icon?: string }[];
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
      {items.map((item) => (
        <Pressable
          key={item.label}
          onPress={item.onPress}
          style={{
            backgroundColor: colors.surfaceElevated,
            borderRadius: radius.lg,
            padding: spacing.md,
            width: '47%',
            minHeight: 76,
            justifyContent: 'center',
            shadowColor: colors.primaryCharcoal,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}>
          <Text style={{ fontFamily: fonts.semiBold, color: colors.primary, fontSize: 15 }}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
