import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { PlanChangeConfirmDialog } from '@/components/plans/PlanChangeConfirmDialog';
import { samplePlan, sampleYearlyPlan } from '../fixtures';

const meta = {
  title: 'Plans/PlanChangeConfirmDialog',
  component: PlanChangeConfirmDialog,
} satisfies Meta<typeof PlanChangeConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [visible, setVisible] = useState(true);
    return (
      <PlanChangeConfirmDialog
        visible={visible}
        plan={samplePlan}
        currentPlan={sampleYearlyPlan}
        effectiveDate="2026-08-01"
        locale="en"
        autoPayEnabled
        onClose={() => setVisible(false)}
        onConfirm={() => setVisible(false)}
      />
    );
  },
};
