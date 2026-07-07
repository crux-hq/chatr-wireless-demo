import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ProvincePlansBar } from '@/components/plans/ProvincePlansBar';

const meta = {
  title: 'Plans/ProvincePlansBar',
  component: ProvincePlansBar,
} satisfies Meta<typeof ProvincePlansBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
