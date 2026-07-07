import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { CartButton } from '@/components/layout/CartButton';
import { useAppStore } from '@/lib/store';
import { useEffect } from 'react';

const meta = {
  title: 'Layout/CartButton',
  component: CartButton,
} satisfies Meta<typeof CartButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: function Render() {
    useEffect(() => {
      useAppStore.setState({ cart: [] });
    }, []);
    return <CartButton />;
  },
};

export const WithItems: Story = {
  render: function Render() {
    useEffect(() => {
      useAppStore.setState({ cart: [{ productId: 'chatr-sim', quantity: 2 }] });
    }, []);
    return <CartButton />;
  },
};
