import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { PlansIntro } from '@/components/plans/PlansIntro';

const meta = {
  title: 'Plans/PlansIntro',
  component: PlansIntro,
} satisfies Meta<typeof PlansIntro>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
