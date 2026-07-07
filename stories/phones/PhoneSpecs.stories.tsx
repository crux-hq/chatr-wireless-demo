import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { PhoneSpecs } from '@/components/phones/PhoneSpecs';
import { samplePhone } from '../fixtures';

const meta = {
  title: 'Phones/PhoneSpecs',
  component: PhoneSpecs,
} satisfies Meta<typeof PhoneSpecs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { sections: samplePhone.specs },
};
