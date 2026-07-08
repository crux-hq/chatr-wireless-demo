import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ProvinceSelectField } from '@/components/plans/ProvinceSelectField';
import { DEFAULT_PROVINCE_CODE } from '@/lib/mock/provinces';

const meta = {
  title: 'Plans/ProvinceSelectField',
  component: ProvinceSelectField,
} satisfies Meta<typeof ProvinceSelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState(DEFAULT_PROVINCE_CODE);
    return <ProvinceSelectField label="Province" required value={value} onChange={setValue} />;
  },
};

export const WithError: Story = {
  args: {
    label: 'Province',
    required: true,
    value: '',
    error: 'This field is required.',
    onChange: () => undefined,
  },
};
