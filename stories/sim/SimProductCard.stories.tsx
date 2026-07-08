import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Package } from 'lucide-react-native';
import { SimProductCard } from '@/components/sim/SimProductCard';
import { SIM_PRODUCT } from '@/lib/mock/sim-product';
import { colors } from '@/lib/theme/colors';

const meta = {
  title: 'SIM/SimProductCard',
  component: SimProductCard,
} satisfies Meta<typeof SimProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Physical: Story = {
  args: {
    name: SIM_PRODUCT.nameEn,
    tag: SIM_PRODUCT.tagEn,
    image: SIM_PRODUCT.image,
    priceLabel: '$10.00',
    featureIcon: <Package color={colors.primary} size={18} />,
    featureLabel: 'Free shipping',
    ctaTitle: 'Buy now',
    onPress: () => undefined,
  },
};
