import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Smartphone } from 'lucide-react-native';
import { SimOptionCard } from '@/app/checkout/_components/SimOptionCard';
import { CheckoutProgress } from '@/app/checkout/_components/CheckoutProgress';
import { CheckoutNav } from '@/app/checkout/_components/CheckoutNav';
import { CheckoutOrderSummary } from '@/app/checkout/_components/CheckoutOrderSummary';
import { colors } from '@/lib/theme/colors';
import { getSimCheckoutStepLabels } from '@/lib/checkout';
import { useTranslation } from 'react-i18next';

const meta = {
  title: 'Checkout/SimOptionCard',
  component: SimOptionCard,
} satisfies Meta<typeof SimOptionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = {
  args: {
    title: 'eSIM',
    description: 'Activate in minutes for free',
    badge: 'MOST POPULAR',
    selected: true,
    onPress: () => undefined,
    icon: <Smartphone color={colors.primary} size={24} />,
  },
};

export const Unselected: Story = {
  args: {
    title: 'Order physical SIM',
    description: 'Free delivery within 5 days',
    selected: false,
    onPress: () => undefined,
    icon: <Smartphone color={colors.primary} size={24} />,
  },
};

export const Progress: Story = {
  render: function Render() {
    const { t } = useTranslation();
    return <CheckoutProgress currentStep={3} labels={getSimCheckoutStepLabels(t)} />;
  },
};

export const Navigation: Story = {
  render: () => <CheckoutNav continueLabel="Continue" onContinue={() => undefined} />,
};

export const OrderSummary: Story = {
  render: () => <CheckoutOrderSummary checkoutMode="sim-only" simType="physical-order" />,
};
