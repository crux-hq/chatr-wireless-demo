import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ChatrLogo } from '@/components/ui/ChatrLogo';

const meta = {
  title: 'UI/ChatrLogo',
  component: ChatrLogo,
} satisfies Meta<typeof ChatrLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { width: 160 },
};

export const Compact: Story = {
  args: { width: 120 },
};
