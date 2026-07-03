import { Text, type StyleProp, type TextStyle } from 'react-native';
import { typography } from '@/lib/theme/typography';

type PageSubtitleProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export function PageSubtitle({ children, style }: PageSubtitleProps) {
  return <Text style={[typography.pageSubtitle, style]}>{children}</Text>;
}
