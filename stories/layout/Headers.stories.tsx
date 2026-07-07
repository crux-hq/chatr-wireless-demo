import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { AppHeaderBar } from '@/components/layout/AppHeaderBar';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { MarketingHeader } from '@/components/homepage/MarketingHeader';
import { NavigationDrawer } from '@/components/layout/NavigationDrawer';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { FullWidthDecorator } from '../../.storybook/decorators';

const meta = {
  title: 'Layout/Headers',
  decorators: [FullWidthDecorator],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;

export const AppHeaderBarDefault: StoryObj = {
  render: () => <AppHeaderBar onMenuPress={() => undefined} trailing={<LanguageToggle />} />,
};

export const PublicHeaderStory: StoryObj = {
  render: () => <PublicHeader />,
};

export const MarketingHeaderStory: StoryObj = {
  render: () => <MarketingHeader onLaunchJourney={() => undefined} />,
};

export const NavigationDrawerOpen: StoryObj = {
  render: function Render() {
    const [visible, setVisible] = useState(true);
    return (
      <NavigationDrawer
        visible={visible}
        onClose={() => setVisible(false)}
        items={[
          { label: 'Plans', onPress: () => undefined },
          { label: 'Phones', onPress: () => undefined },
          { label: 'Support', onPress: () => undefined },
        ]}
        footerActions={[
          { label: 'Top up', variant: 'primary', onPress: () => undefined },
          { label: 'Sign in', variant: 'outline', onPress: () => undefined },
        ]}
      />
    );
  },
};
