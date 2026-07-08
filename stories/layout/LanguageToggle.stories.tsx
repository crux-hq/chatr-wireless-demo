import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { LanguageToggle } from '@/components/layout/LanguageToggle';

const meta = {
  title: 'Layout/LanguageToggle',
  component: LanguageToggle,
} satisfies Meta<typeof LanguageToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
