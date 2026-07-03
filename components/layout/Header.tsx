import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/lib/store';
import i18n from '@/lib/i18n';
import { ChatrLogoLink } from '@/components/ui/ChatrLogo';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export function LanguageToggle({ onDark = true }: { onDark?: boolean }) {
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);
  const { t } = useTranslation();

  const toggle = () => {
    const next = locale === 'en' ? 'fr' : 'en';
    setLocale(next);
    void i18n.changeLanguage(next);
  };

  return (
    <Pressable
      onPress={toggle}
      style={{
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: 6,
        borderRadius: radius.pill,
        borderWidth: 1.5,
        borderColor: onDark ? 'rgba(255,255,255,0.7)' : colors.primary,
      }}>
      <Text
        style={{
          color: onDark ? colors.white : colors.primary,
          fontFamily: fonts.semiBold,
          fontSize: 13,
        }}>
        {locale === 'en' ? t('language.fr') : t('language.en')}
      </Text>
    </Pressable>
  );
}

export function Header({ title, right }: { title?: string; right?: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: colors.white,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md + 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View>
        <ChatrLogoLink />
        {title ? (
          <Text
            style={{
              color: colors.text,
              opacity: 0.92,
              fontSize: 16,
              marginTop: 6,
              fontFamily: fonts.medium,
            }}>
            {title}
          </Text>
        ) : null}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        {right}
        <LanguageToggle onDark={false} />
      </View>
    </View>
  );
}

export function PromoBanner({ title, subtitle }: { title: string; subtitle: string }) {
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
      <View
        style={{
          marginTop: spacing.md,
          alignSelf: 'flex-start',
          backgroundColor: colors.accent,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs + 2,
          borderRadius: radius.pill,
        }}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: colors.textOnAccent }}>Auto-Pay bonus</Text>
      </View>
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
