import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { TestimonialCarousel } from '@/components/homepage/TestimonialCarousel';

const meta = {
  title: 'Homepage/TestimonialCarousel',
  component: TestimonialCarousel,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TestimonialCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onAllReviews: () => undefined },
};
