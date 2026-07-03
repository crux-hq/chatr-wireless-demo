import { View, Text, Pressable } from 'react-native';
import { ChatrLogo } from '@/components/ui/ChatrLogo';
import { FOOTER_LINKS } from '@/lib/homepage-data';
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
  links: readonly { label: string; journeyId: string }[];
  onLaunch: (id: string) => void;
}) {
  return (
    <View style={{ flex: 1, minWidth: 140, marginBottom: spacing.lg }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.white, marginBottom: spacing.sm }}>
        {title}
      </Text>
      {links.map((link) => (
        <Pressable key={link.label} onPress={() => onLaunch(link.journeyId)} style={{ paddingVertical: 4 }}>
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.lavenderMid }}>{link.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function HomeFooter({ onLaunchJourney }: HomeFooterProps) {
  return (
    <View style={{ backgroundColor: colors.primaryDark, padding: spacing.lg, paddingBottom: spacing.xxl }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
        <FooterColumn title="Shop & Plans" links={FOOTER_LINKS.shop} onLaunch={onLaunchJourney} />
        <FooterColumn title="Support" links={FOOTER_LINKS.support} onLaunch={onLaunchJourney} />
        <FooterColumn title="My Chatr" links={FOOTER_LINKS.myChatr} onLaunch={onLaunchJourney} />
        <FooterColumn title="About" links={FOOTER_LINKS.about} onLaunch={onLaunchJourney} />
      </View>
      <View style={{ marginTop: spacing.lg, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.primaryLight }}>
        <ChatrLogo height={28} />
        <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.lavenderMid, marginTop: spacing.sm }}>
          © {new Date().getFullYear()} chatr mobile. Demo app — mock data only.
        </Text>
      </View>
    </View>
  );
}
