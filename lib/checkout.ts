import type { SimType, UserProfile } from '@/lib/mock/types';
import { DEFAULT_PROVINCE_CODE, getProvinceByCode } from '@/lib/mock/provinces';

export type CheckoutMode = 'plan' | 'sim-only';
export type PhoneNumberMode = 'new' | 'port';

export type CheckoutCustomerDetails = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
};

export const EMPTY_CUSTOMER_DETAILS: CheckoutCustomerDetails = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  city: '',
  province: DEFAULT_PROVINCE_CODE,
  postalCode: '',
};

export function getInitialCustomerDetails(
  user: UserProfile | null,
  saved?: Partial<CheckoutCustomerDetails>,
): CheckoutCustomerDetails {
  return {
    firstName: saved?.firstName || user?.firstName || '',
    lastName: saved?.lastName || user?.lastName || '',
    email: saved?.email || user?.email || '',
    address: saved?.address || user?.address || '',
    city: saved?.city || user?.city || '',
    province: saved?.province || user?.province || DEFAULT_PROVINCE_CODE,
    postalCode: saved?.postalCode || user?.postalCode || '',
  };
}

export function isCustomerDetailsComplete(details?: Partial<CheckoutCustomerDetails>) {
  return Object.keys(getCustomerDetailsFieldErrors(details)).length === 0;
}

export function getCustomerDetailsFieldErrors(
  details?: Partial<CheckoutCustomerDetails>,
): Partial<Record<keyof CheckoutCustomerDetails, string>> {
  if (!details) {
    return {
      firstName: 'required',
      lastName: 'required',
      email: 'required',
      address: 'required',
      city: 'required',
      province: 'required',
      postalCode: 'required',
    };
  }

  const errors: Partial<Record<keyof CheckoutCustomerDetails, string>> = {};
  const email = details.email?.trim() ?? '';

  if (!details.firstName?.trim()) errors.firstName = 'required';
  if (!details.lastName?.trim()) errors.lastName = 'required';
  if (!email) errors.email = 'required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'invalidEmail';
  if (!details.address?.trim()) errors.address = 'required';
  if (!details.city?.trim()) errors.city = 'required';
  if (!details.province?.trim() || !getProvinceByCode(details.province.trim())) errors.province = 'required';
  if (!details.postalCode?.trim()) errors.postalCode = 'required';
  else if (details.postalCode.trim().replace(/\s/g, '').length < 6) errors.postalCode = 'invalidPostalCode';

  return errors;
}

export function formatCustomerAddress(details: CheckoutCustomerDetails) {
  return `${details.address}, ${details.city}, ${details.province} ${details.postalCode}`;
}

export const CHECKOUT_PHONE_OPTIONS = [
  { id: '416-555-0142', areaKey: 'checkout.phoneOptions.416.area' },
  { id: '647-555-0198', areaKey: 'checkout.phoneOptions.647.area' },
  { id: '905-555-0137', areaKey: 'checkout.phoneOptions.905.area' },
] as const;

export const CHECKOUT_PAYMENT_OPTIONS = [
  { id: 'visa-4242', type: 'card' as const, brand: 'Visa', last4: '4242', expiry: '12/28' },
  { id: 'mc-5555', type: 'card' as const, brand: 'Mastercard', last4: '5555', expiry: '09/27' },
] as const;

export const CHECKOUT_VOUCHER_PAYMENT_ID = 'voucher';

export function isCheckoutVoucherPayment(paymentMethodId: string | null | undefined) {
  return paymentMethodId === CHECKOUT_VOUCHER_PAYMENT_ID || (paymentMethodId?.startsWith('voucher:') ?? false);
}

export function getCheckoutVoucherCode(paymentMethodId: string | null | undefined) {
  if (!paymentMethodId?.startsWith('voucher:')) return '';
  return paymentMethodId.slice('voucher:'.length);
}

export function buildCheckoutVoucherPaymentId(code: string) {
  return `${CHECKOUT_VOUCHER_PAYMENT_ID}:${code.trim().toUpperCase()}`;
}

/** Demo customer used when /preview soft-navigates into mid-checkout steps. */
export const PREVIEW_CHECKOUT_CUSTOMER: CheckoutCustomerDetails = {
  firstName: 'Alex',
  lastName: 'Nguyen',
  email: 'alex.nguyen@email.com',
  address: '100 Queen St W',
  city: 'Toronto',
  province: 'ON',
  postalCode: 'M5H 2N2',
};

/**
 * Seed activation draft far enough for a checkout deep link so step guards
 * (missing plan / details / payment) do not bounce the preview iframe.
 */
export type PreviewCheckoutDraftSeed = Partial<{
  checkoutMode: CheckoutMode;
  physicalSimOnly: boolean;
  planId: string;
  autoPay: boolean;
  simType: SimType | null;
  phoneNumber: string;
  phoneNumberMode: PhoneNumberMode;
  paymentMethodId: string | null;
  customerDetails: CheckoutCustomerDetails;
}>;

export function getPreviewCheckoutDraftSeed(href: string): PreviewCheckoutDraftSeed | null {
  let path = href;
  let planId = '35gb';
  try {
    const url = new URL(href, 'https://preview.local');
    path = url.pathname;
    planId = url.searchParams.get('planId') ?? planId;
  } catch {
    // keep defaults
  }

  if (!path.startsWith('/checkout')) return null;

  const seed: PreviewCheckoutDraftSeed = {
    checkoutMode: 'plan',
    physicalSimOnly: false,
    planId,
    autoPay: true,
  };

  if (path === '/checkout/sim' || path.startsWith('/checkout/sim')) {
    return {
      ...seed,
      simType: null,
      phoneNumber: '',
      phoneNumberMode: 'new',
      paymentMethodId: null,
      customerDetails: { ...EMPTY_CUSTOMER_DETAILS },
    };
  }

  seed.simType = 'esim';

  if (path.startsWith('/checkout/phone-number')) {
    return {
      ...seed,
      phoneNumber: '',
      phoneNumberMode: 'new',
      paymentMethodId: null,
      customerDetails: { ...EMPTY_CUSTOMER_DETAILS },
    };
  }

  seed.phoneNumber = CHECKOUT_PHONE_OPTIONS[0].id;
  seed.phoneNumberMode = 'new';

  if (path.startsWith('/checkout/details')) {
    return { ...seed, paymentMethodId: null, customerDetails: { ...EMPTY_CUSTOMER_DETAILS } };
  }

  seed.customerDetails = { ...PREVIEW_CHECKOUT_CUSTOMER };

  if (path.startsWith('/checkout/payment')) {
    return { ...seed, paymentMethodId: null };
  }

  if (path.startsWith('/checkout/review') || path.startsWith('/checkout/success')) {
    return { ...seed, paymentMethodId: CHECKOUT_PAYMENT_OPTIONS[0].id };
  }

  return seed;
}

export function isSimOnlyCheckout(checkoutMode: CheckoutMode) {
  return checkoutMode === 'sim-only';
}

export function getPlanCheckoutStepLabels(t: (key: string) => string) {
  return [
    t('checkout.steps.selectPlan'),
    t('checkout.steps.phoneSim'),
    t('checkout.steps.personalDetails'),
    t('checkout.steps.payment'),
    t('checkout.steps.review'),
  ] as const;
}

export function getSimCheckoutStepLabels(t: (key: string) => string) {
  return [
    t('checkout.steps.selectSim'),
    t('checkout.steps.selectNumber'),
    t('checkout.steps.personalDetails'),
    t('checkout.steps.payment'),
    t('checkout.steps.review'),
  ] as const;
}

export function getCheckoutStepLabels(checkoutMode: CheckoutMode, t: (key: string) => string) {
  return isSimOnlyCheckout(checkoutMode) ? getSimCheckoutStepLabels(t) : getPlanCheckoutStepLabels(t);
}

export function getSimProductPrice(simType: SimType | null) {
  return simType === 'physical-order' ? 10 : 0;
}
