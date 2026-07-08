import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { PhoneImage } from '@/components/phones/PhoneImage';
import { samplePhone } from '../fixtures';

const meta = {
  title: 'Phones/PhoneImage',
  component: PhoneImage,
} satisfies Meta<typeof PhoneImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    phone: samplePhone,
    height: 200,
    onPress: () => undefined,
  },
};

export const BadgeRight: Story = {
  args: {
    phone: samplePhone,
    height: 200,
    badgePosition: 'right',
  },
};
