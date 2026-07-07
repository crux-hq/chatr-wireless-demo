import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { PageTitle } from '@/components/layout/PageTitle';
import { PageSubtitle } from '@/components/layout/PageSubtitle';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { fonts } from '@/lib/theme/typography';

const meta = {
  title: 'Layout/PageTitle',
  component: PageTitle,
} satisfies Meta<typeof PageTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Prepaid phone plans' },
};

export const WithLeading: Story = {
  args: {
    children: 'Account information',
    leading: (
      <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
        <ChevronLeft size={20} color={colors.primary} />
        <Text style={{ color: colors.primary, fontFamily: fonts.semiBold }}>Back</Text>
      </Pressable>
    ),
  },
};

export const Subtitle: Story = {
  render: () => <PageSubtitle>Affordable prepaid plans from coast to coast.</PageSubtitle>,
};
