import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { BonusClaimDialog } from '@/components/ui/BonusClaimDialog';

const meta = {
  title: 'UI/BonusClaimDialog',
  component: BonusClaimDialog,
} satisfies Meta<typeof BonusClaimDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [visible, setVisible] = useState(true);
    return (
      <BonusClaimDialog visible={visible} gb={5} onClose={() => setVisible(false)} />
    );
  },
};
