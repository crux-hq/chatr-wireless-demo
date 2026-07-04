import type { ImageSourcePropType } from 'react-native';
import { ESIM_PRODUCT, SIM_PRODUCT } from '@/lib/mock/sim-product';

export type CartProduct = {
  id: string;
  nameEn: string;
  nameFr: string;
  price: number;
  image: ImageSourcePropType;
};

const CART_PRODUCT_MAP: Record<string, CartProduct> = {
  [SIM_PRODUCT.id]: {
    id: SIM_PRODUCT.id,
    nameEn: SIM_PRODUCT.nameEn,
    nameFr: SIM_PRODUCT.nameFr,
    price: SIM_PRODUCT.price,
    image: SIM_PRODUCT.image,
  },
  [ESIM_PRODUCT.id]: {
    id: ESIM_PRODUCT.id,
    nameEn: ESIM_PRODUCT.nameEn,
    nameFr: ESIM_PRODUCT.nameFr,
    price: ESIM_PRODUCT.price,
    image: ESIM_PRODUCT.image,
  },
};

export function getCartProduct(productId: string): CartProduct | undefined {
  return CART_PRODUCT_MAP[productId];
}
