import { Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/lib/store';
import { colors, spacing, radius } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

export function LanguageToggle({ onDark = true }: { onDark?: boolean }) {
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);
  const { t } = useTranslation();

  const toggle = () => {
    setLocale(locale === 'en' ? 'fr' : 'en');
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
