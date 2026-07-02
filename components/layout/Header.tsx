import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/lib/store';
import i18n from '@/lib/i18n';
import { colors, spacing } from '@/lib/theme/colors';

export function LanguageToggle() {
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
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.green,
      }}>
      <Text style={{ color: colors.green, fontWeight: '600', fontSize: 13 }}>
        {locale === 'en' ? t('language.fr') : t('language.en')}
      </Text>
    </Pressable>
  );
}

export function Header({ title, right }: { title?: string; right?: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: colors.green,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View>
        <Text style={{ color: colors.white, fontWeight: '800', fontSize: 22 }}>chatr</Text>
        {title ? <Text style={{ color: colors.white, opacity: 0.9, fontSize: 14 }}>{title}</Text> : null}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {right}
        <LanguageToggle />
      </View>
    </View>
  );
}

export function PromoBanner({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View
      style={{
        backgroundColor: colors.yellow,
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.md,
      }}>
      <Text style={{ fontWeight: '800', fontSize: 16, color: colors.black }}>{title}</Text>
      <Text style={{ color: colors.black, marginTop: 4, opacity: 0.8 }}>{subtitle}</Text>
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
            backgroundColor: colors.gray,
            borderRadius: 12,
            padding: spacing.md,
            width: '47%',
            minHeight: 72,
            justifyContent: 'center',
          }}>
          <Text style={{ fontWeight: '700', color: colors.green, fontSize: 15 }}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
