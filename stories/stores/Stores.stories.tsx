import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { StoreDetailCard } from '@/components/stores/StoreDetailCard';
import { RetailCategoriesSection } from '@/components/stores/RetailCategoriesSection';
import { sampleStore } from '../fixtures';

const meta = {
  title: 'Stores/StoreDetailCard',
  component: StoreDetailCard,
} satisfies Meta<typeof StoreDetailCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { store: sampleStore, onClose: () => undefined },
};

export const RetailCategories: Story = {
  render: () => <RetailCategoriesSection />,
};
