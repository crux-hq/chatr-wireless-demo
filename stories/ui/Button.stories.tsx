import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Button, CtaButton, Card, Badge, Section, SectionTitle } from '@/components/ui/Button';
import { spacing } from '@/lib/theme/colors';
import { PrimaryBackgroundDecorator } from '../../.storybook/decorators';

const meta = {
  title: 'UI/Button',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { title: 'Primary action', onPress: () => undefined, variant: 'primary' },
};

export const Secondary: Story = {
  args: { title: 'Secondary action', onPress: () => undefined, variant: 'secondary' },
};

export const Outline: Story = {
  args: { title: 'Outline action', onPress: () => undefined, variant: 'outline' },
};

export const Ghost: Story = {
  args: { title: 'Ghost action', onPress: () => undefined, variant: 'ghost' },
};

export const Loading: Story = {
  args: { title: 'Loading', onPress: () => undefined, loading: true },
};

export const Disabled: Story = {
  args: { title: 'Disabled', onPress: () => undefined, disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: spacing.sm }}>
      <Button title="Primary" onPress={() => undefined} />
      <Button title="Secondary" onPress={() => undefined} variant="secondary" />
      <Button title="Outline" onPress={() => undefined} variant="outline" />
      <Button title="Ghost" onPress={() => undefined} variant="ghost" />
      <CtaButton title="CTA with chevron" onPress={() => undefined} />
    </View>
  ),
};

export const OnPrimaryBackground: Story = {
  decorators: [PrimaryBackgroundDecorator],
  render: () => (
    <View style={{ gap: spacing.sm }}>
      <Button title="Primary" onPress={() => undefined} />
      <Button title="Outline" onPress={() => undefined} variant="outline" />
    </View>
  ),
};

export const CardAndBadge: Story = {
  render: () => (
    <View style={{ gap: spacing.md }}>
      <Card>
        <SectionTitle>Section title</SectionTitle>
        <Badge label="MOST POPULAR" />
      </Card>
      <Section title="Section wrapper">
        <Badge label="Yearly plan" />
      </Section>
    </View>
  ),
};
