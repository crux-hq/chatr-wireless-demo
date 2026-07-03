import { View, type StyleProp, type ViewStyle } from 'react-native';
import { HomeFooter } from '@/components/homepage/HomeFooter';
import { launchPublicJourney } from '@/lib/nav-public';
import { spacing } from '@/lib/theme/colors';

type PublicHomeFooterProps = {
  /** Horizontal inset to negate so the footer spans full width inside padded scroll content */
  bleedPadding?: number;
  style?: StyleProp<ViewStyle>;
};

export function PublicHomeFooter({ bleedPadding = spacing.md, style }: PublicHomeFooterProps) {
  return (
    <View
      style={[
        bleedPadding > 0
          ? { marginHorizontal: -bleedPadding, marginTop: spacing.xl }
          : { marginTop: spacing.xl },
        style,
      ]}>
      <HomeFooter onLaunchJourney={launchPublicJourney} />
    </View>
  );
}
