import { ScrollView, type ScrollViewProps } from 'react-native';
import { PAGE_TITLE_FADE_HEIGHT } from '@/components/layout/PageTitle';

export function PageScrollView({ style, contentContainerStyle, ...rest }: ScrollViewProps) {
  return (
    <ScrollView
      {...rest}
      style={[{ flex: 1, marginTop: -PAGE_TITLE_FADE_HEIGHT }, style]}
      contentContainerStyle={[{ paddingTop: PAGE_TITLE_FADE_HEIGHT }, contentContainerStyle]}
    />
  );
}
