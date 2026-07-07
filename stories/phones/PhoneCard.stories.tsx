import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { PhoneCard } from '@/components/phones/PhoneCard';
import { samplePhone } from '../fixtures';

const meta = {
  title: 'Phones/PhoneCard',
  component: PhoneCard,
} satisfies Meta<typeof PhoneCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { phone: samplePhone },
};
