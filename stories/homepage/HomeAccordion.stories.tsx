import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { HomeAccordion } from '@/components/homepage/HomeAccordion';

const meta = {
  title: 'Homepage/HomeAccordion',
  component: HomeAccordion,
} satisfies Meta<typeof HomeAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { id: '1', title: 'How can I purchase a SIM card?', body: 'Order online or visit a chatr store near you.' },
  { id: '2', title: 'How do I activate my SIM?', body: 'Follow the activation wizard after your SIM arrives.' },
];

export const Default: Story = {
  render: function Render() {
    const [expanded, setExpanded] = useState<string | null>('1');
    return <HomeAccordion items={items} expandedId={expanded} onToggle={setExpanded} />;
  },
};
