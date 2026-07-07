import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { PlanInclusions } from '@/components/plans/PlanInclusions';
import { samplePlan } from '../fixtures';

const meta = {
  title: 'Plans/PlanInclusions',
  component: PlanInclusions,
} satisfies Meta<typeof PlanInclusions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { plan: samplePlan },
};
