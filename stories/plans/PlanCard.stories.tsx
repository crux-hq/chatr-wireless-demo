import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { PlanCard, PlanFilter } from '@/components/plans/PlanCard';
import { samplePlan, sampleYearlyPlan } from '../fixtures';
import { useState } from 'react';

const meta = {
  title: 'Plans/PlanCard',
  component: PlanCard,
} satisfies Meta<typeof PlanCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { plan: samplePlan },
};

export const BestDeal: Story = {
  args: { plan: samplePlan, showBuyActions: true },
};

export const Yearly: Story = {
  args: { plan: sampleYearlyPlan },
};

export const CurrentPlan: Story = {
  args: { plan: samplePlan, isCurrent: true },
};

export const Filter: Story = {
  render: function Render() {
    const [value, setValue] = useState('all');
    return (
      <PlanFilter
        value={value}
        onChange={setValue}
        options={[
          { key: 'all', label: 'All' },
          { key: 'data', label: 'Talk, Text & Data' },
          { key: 'talk', label: 'Talk & Text' },
        ]}
      />
    );
  },
};
