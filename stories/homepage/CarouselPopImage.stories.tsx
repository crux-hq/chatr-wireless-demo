import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { CarouselPopImage } from '@/components/homepage/CarouselPopImage';
import { samplePhone } from '../fixtures';

const meta = {
  title: 'Homepage/CarouselPopImage',
  component: CarouselPopImage,
} satisfies Meta<typeof CarouselPopImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    source: samplePhone.image,
    active: true,
    style: { width: 200, height: 240 },
  },
};

export const Inactive: Story = {
  args: {
    source: samplePhone.image,
    active: false,
    style: { width: 200, height: 240 },
  },
};
