import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Input } from '@/components/ui/Input';
import { spacing } from '@/lib/theme/colors';

const meta = {
  title: 'UI/Input',
  component: Input,
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState('Taylor');
    return <Input label="First name" value={value} onChangeText={setValue} />;
  },
};

export const Required: Story = {
  render: function Render() {
    const [value, setValue] = useState('');
    return <Input label="Email" required value={value} onChangeText={setValue} keyboardType="email-address" />;
  },
};

export const WithError: Story = {
  args: {
    label: 'Postal code',
    required: true,
    value: 'ef',
    error: 'Enter a valid postal code (e.g. M5V 2T6).',
    onChangeText: () => undefined,
  },
};

export const FormExample: Story = {
  render: function Render() {
    const [firstName, setFirstName] = useState('Taylor');
    const [email, setEmail] = useState('demo@chatr.ca');
    return (
      <View style={{ gap: spacing.sm }}>
        <Input label="First name" required value={firstName} onChangeText={setFirstName} />
        <Input label="Email" required value={email} onChangeText={setEmail} />
      </View>
    );
  },
};
