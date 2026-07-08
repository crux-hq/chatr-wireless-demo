import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { BackToAddOns } from '@/components/addons/BackToAddOns';
import { BackToAccountSettings } from '@/components/profile/BackToAccountSettings';

const meta = {
  title: 'Navigation/MoreBackLinks',
} satisfies Meta;

export default meta;

export const BackToAddOnsLink: StoryObj = {
  render: () => <BackToAddOns />,
};

export const BackToAccountSettingsLink: StoryObj = {
  render: () => <BackToAccountSettings />,
};
