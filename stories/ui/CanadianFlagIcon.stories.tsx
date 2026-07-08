import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { CanadianFlagIcon } from '@/components/icons/CanadianFlagIcon';

const meta = {
  title: 'UI/CanadianFlagIcon',
  component: CanadianFlagIcon,
} satisfies Meta<typeof CanadianFlagIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: 24 },
};
