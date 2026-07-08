import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { DailyUsageChart } from '@/components/usage/DailyUsageChart';
import { colors } from '@/lib/theme/colors';
import { sampleUser } from '../fixtures';

const meta = {
  title: 'Usage/DailyUsageChart',
  component: DailyUsageChart,
} satisfies Meta<typeof DailyUsageChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const chartData = sampleUser.usage.dailyDataMb.map((value, index) => ({
  value,
  label: `${index + 1}`,
  frontColor: colors.green,
}));

export const Default: Story = {
  args: { data: chartData },
};
