import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { PlanDetailSections, PlanDataBreakdown } from '@/components/plans/PlanDetailSections';
import { samplePlan } from '../fixtures';

const meta = {
  title: 'Plans/PlanDetailSections',
  component: PlanDetailSections,
} satisfies Meta<typeof PlanDetailSections>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sections: Story = {
  args: { plan: samplePlan, locale: 'en' },
};

export const DataBreakdown: Story = {
  render: () => <PlanDataBreakdown plan={samplePlan} locale="en" />,
};
