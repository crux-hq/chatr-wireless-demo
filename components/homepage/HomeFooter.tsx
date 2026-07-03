import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FOOTER_LINKS, FOOTER_SECTIONS } from '@/lib/homepage-data';
import { colors, spacing } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

type HomeFooterProps = {
  onLaunchJourney: (journeyId: string) => void;
};

function FooterColumn({
  title,
  links,
  onLaunch,
}: {
  title: string;
  links: readonly { labelKey: string; journeyId: string }[];
  onLaunch: (id: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, minWidth: 140, marginBottom: spacing.lg }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.white, marginBottom: spacing.sm }}>
        {title}
      </Text>
      {links.map((link) => (
        <Pressable key={link.labelKey} onPress={() => onLaunch(link.journeyId)} style={{ paddingVertical: 4 }}>
          <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.lavenderMid }}>{t(link.labelKey)}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function HomeFooter({ onLaunchJourney }: HomeFooterProps) {
  const { t } = useTranslation();

  return (
    <View style={{ backgroundColor: colors.primaryDark, padding: spacing.lg, paddingBottom: spacing.xxl }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
        {FOOTER_SECTIONS.map((section) => (
          <FooterColumn
            key={section.linksKey}
            title={t(section.titleKey)}
            links={FOOTER_LINKS[section.linksKey]}
            onLaunch={onLaunchJourney}
          />
        ))}
      </View>
      <View style={{ marginTop: spacing.lg, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.primaryLight }}>
        <Text style={{ fontFamily: fonts.regular, fontSize: 16, color: colors.lavenderMid }}>
          {t('homepage.footer.copyright', { year: new Date().getFullYear() })}
        </Text>
      </View>
    </View>
  );
}
