import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { SupportCategoryCard } from '@/components/support/SupportCategoryCard';
import { BackToSupport } from '@/components/support/BackToSupport';
import { SubmitTicketDialog } from '@/components/support/SubmitTicketDialog';

const meta = {
  title: 'Support/SupportCategoryCard',
  component: SupportCategoryCard,
} satisfies Meta<typeof SupportCategoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'network-device-sim',
    title: 'SIM & activation',
    onPress: () => undefined,
  },
};

export const BackLink: Story = {
  render: () => <BackToSupport />,
};

export const SubmitTicket: StoryObj = {
  render: function Render() {
    const [visible, setVisible] = useState(true);
    return <SubmitTicketDialog visible={visible} onClose={() => setVisible(false)} />;
  },
};
