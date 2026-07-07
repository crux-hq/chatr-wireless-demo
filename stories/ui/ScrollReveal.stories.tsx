import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text } from 'react-native';
import { Card } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const meta = {
  title: 'UI/ScrollReveal',
  component: ScrollReveal,
} satisfies Meta<typeof ScrollReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollReveal scrollY={240}>
      <Card>
        <Text>Content revealed on scroll</Text>
      </Card>
    </ScrollReveal>
  ),
};
