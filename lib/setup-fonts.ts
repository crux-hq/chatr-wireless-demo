import { Text, TextInput } from 'react-native';
import { fonts } from '@/lib/theme/typography';

export function applyDefaultFontFamily() {
  const defaultStyle = { fontFamily: fonts.regular };

  Text.defaultProps = Text.defaultProps ?? {};
  Text.defaultProps.style = defaultStyle;

  TextInput.defaultProps = TextInput.defaultProps ?? {};
  TextInput.defaultProps.style = defaultStyle;
}
