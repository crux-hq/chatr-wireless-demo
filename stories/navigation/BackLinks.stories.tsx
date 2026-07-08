import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { BackToAccountSettings } from '@/components/profile/BackToAccountSettings';
import { BackToAddOns } from '@/components/addons/BackToAddOns';

const meta = {
  title: 'Navigation/BackLinks',
} satisfies Meta;

export default meta;

export const AccountSettings: StoryObj = {
  render: () => <BackToAccountSettings />,
};

export const AddOns: StoryObj = {
  render: () => <BackToAddOns />,
};
