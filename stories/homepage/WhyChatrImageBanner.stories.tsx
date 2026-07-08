import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { WhyChatrImageBanner } from '@/components/homepage/WhyChatrImageBanner';
import { FullWidthDecorator } from '../../.storybook/decorators';

const meta = {
  title: 'Homepage/WhyChatrImageBanner',
  component: WhyChatrImageBanner,
  decorators: [FullWidthDecorator],
} satisfies Meta<typeof WhyChatrImageBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { scrollY: 0 },
};

export const Scrolled: Story = {
  args: { scrollY: 400 },
};
