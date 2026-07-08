import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { SimOrderSuccessDialog } from '@/components/sim/SimOrderSuccessDialog';

const meta = {
  title: 'SIM/SimOrderSuccessDialog',
  component: SimOrderSuccessDialog,
} satisfies Meta<typeof SimOrderSuccessDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [visible, setVisible] = useState(true);
    return (
      <SimOrderSuccessDialog
        visible={visible}
        onClose={() => setVisible(false)}
        onActivate={() => setVisible(false)}
        onBrowsePlans={() => setVisible(false)}
      />
    );
  },
};
