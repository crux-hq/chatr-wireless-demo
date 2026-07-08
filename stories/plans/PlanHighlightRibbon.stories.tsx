import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { PlanHighlightRibbon } from '@/components/plans/PlanHighlightRibbon';
import { samplePlan, sampleYearlyPlan } from '../fixtures';

const meta = {
  title: 'Plans/PlanHighlightRibbon',
  component: PlanHighlightRibbon,
} satisfies Meta<typeof PlanHighlightRibbon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BestDeal: Story = {
  render: () => (
    <View style={{ borderRadius: 12, overflow: 'hidden' }}>
      <PlanHighlightRibbon highlight="best-deal" />
    </View>
  ),
};

export const Yearly: Story = {
  render: () => (
    <View style={{ borderRadius: 12, overflow: 'hidden' }}>
      <PlanHighlightRibbon highlight="yearly" />
    </View>
  ),
};

export const FromPlan: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <PlanHighlightRibbon highlight={samplePlan.highlight!} />
      <PlanHighlightRibbon highlight={sampleYearlyPlan.highlight!} />
    </View>
  ),
};
