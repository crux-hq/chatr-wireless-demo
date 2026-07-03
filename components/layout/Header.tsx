import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/lib/store';
import { AuthenticatedHeader } from '@/components/layout/AuthenticatedHeader';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts, typography } from '@/lib/theme/typography';

export { LanguageToggle } from '@/components/layout/LanguageToggle';

export function Header() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <AuthenticatedHeader />;
  }

  return <PublicHeader />;
}

export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        ...typography.pageTitle,
        paddingHorizontal: spacing.lg,
        marginTop: spacing.xl,
        marginBottom: spacing.lg,
      }}>
      {children}
    </Text>
  );
}

export function PromoBanner({
  title,
  subtitle,
  onClaimBonus,
  bonusClaimed = false,
}: {
  title: string;
  subtitle: string;
  onClaimBonus?: () => void;
  bonusClaimed?: boolean;
}) {
  const { t } = useTranslation();
  const showClaimButton = onClaimBonus && !bonusClaimed;

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
        {t('plans.autoPayBonus')}
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
      {showClaimButton ? (
        <Pressable
          onPress={onClaimBonus}
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
