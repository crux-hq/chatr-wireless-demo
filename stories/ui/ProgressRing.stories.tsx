import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { spacing } from '@/lib/theme/colors';

const meta = {
  title: 'UI/ProgressRing',
  component: ProgressRing,
} satisfies Meta<typeof ProgressRing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DataUsage: Story = {
  args: {
    percent: 57,
    label: 'Data used',
    sublabel: '20.5 GB of 35 GB',
  },
};

export const Unlimited: Story = {
  args: {
    percent: 42,
    label: 'Texts',
    sublabel: 'Unlimited',
    unlimited: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: spacing.lg, alignItems: 'center' }}>
      <ProgressRing percent={25} label="Compact" compact />
      <ProgressRing percent={55} label="Default" />
      <ProgressRing percent={80} label="Large" size={120} />
    </View>
  ),
};
