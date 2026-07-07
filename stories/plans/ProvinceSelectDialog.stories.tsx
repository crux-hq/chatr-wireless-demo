import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ProvinceSelectDialog } from '@/components/plans/ProvinceSelectDialog';
import { Button } from '@/components/ui/Button';
import { DEFAULT_PROVINCE_CODE } from '@/lib/mock/provinces';

const meta = {
  title: 'Plans/ProvinceSelectDialog',
  component: ProvinceSelectDialog,
} satisfies Meta<typeof ProvinceSelectDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [visible, setVisible] = useState(true);
    const [selected, setSelected] = useState(DEFAULT_PROVINCE_CODE);
    return (
      <>
        <Button title="Open province dialog" onPress={() => setVisible(true)} />
        <ProvinceSelectDialog
          visible={visible}
          selected={selected}
          onClose={() => setVisible(false)}
          onConfirm={setSelected}
        />
      </>
    );
  },
};
