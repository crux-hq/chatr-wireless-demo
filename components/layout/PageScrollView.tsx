import { forwardRef } from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';
import { PAGE_TITLE_FADE_HEIGHT } from '@/components/layout/PageTitle';

export const PageScrollView = forwardRef<ScrollView, ScrollViewProps>(function PageScrollView(
  { style, contentContainerStyle, ...rest },
  ref,
) {
  return (
    <ScrollView
      ref={ref}
      {...rest}
      style={[{ flex: 1, marginTop: -PAGE_TITLE_FADE_HEIGHT }, style]}
      contentContainerStyle={[{ paddingTop: PAGE_TITLE_FADE_HEIGHT }, contentContainerStyle]}
    />
  );
});
