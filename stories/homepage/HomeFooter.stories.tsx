import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { HomeFooter } from '@/components/homepage/HomeFooter';

const meta = {
  title: 'Homepage/HomeFooter',
  component: HomeFooter,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HomeFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onNavigate: () => undefined,
  },
};
