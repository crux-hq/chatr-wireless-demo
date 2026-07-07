import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';

const meta = {
  title: 'UI/Toast',
  component: Toast,
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [visible, setVisible] = useState(true);
    return (
      <>
        <Button title="Show toast" onPress={() => setVisible(true)} />
        <Toast message="This phone is compatible with eSIM." visible={visible} onHide={() => setVisible(false)} />
      </>
    );
  },
};
