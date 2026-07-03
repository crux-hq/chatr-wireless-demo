import { Text, TextInput } from 'react-native';
import { fonts } from '@/lib/theme/typography';

const defaultFontStyle = { fontFamily: fonts.regular };

type TextWithDefaults = typeof Text & {
  defaultProps?: { style?: object };
};

export function applyDefaultFontFamily() {
  const RNText = Text as TextWithDefaults;
  const RNTextInput = TextInput as TextWithDefaults;

  RNText.defaultProps = { ...(RNText.defaultProps ?? {}), style: defaultFontStyle };
  RNTextInput.defaultProps = { ...(RNTextInput.defaultProps ?? {}), style: defaultFontStyle };
}
