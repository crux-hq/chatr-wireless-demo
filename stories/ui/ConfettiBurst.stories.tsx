import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { ConfettiBurst } from '@/components/ui/ConfettiBurst';
import { colors } from '@/lib/theme/colors';

const meta = {
  title: 'UI/ConfettiBurst',
  component: ConfettiBurst,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ConfettiBurst>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  decorators: [
    (Story) => (
      <View style={{ flex: 1, minHeight: 400, backgroundColor: colors.primary }}>
        <Story />
      </View>
    ),
  ],
  args: { active: true },
};

export const Inactive: Story = {
  args: { active: false },
};
