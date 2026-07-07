import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { AuthScreenShell } from '@/components/layout/AuthScreenShell';
import { Button } from '@/components/ui/Button';

const meta = {
  title: 'Layout/AuthScreenShell',
  component: AuthScreenShell,
} satisfies Meta<typeof AuthScreenShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Welcome to My chatr',
    children: <Button title="Sign in" onPress={() => undefined} />,
  },
};
