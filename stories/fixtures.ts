import { PLANS } from '@/lib/mock/plans';
import { PHONES } from '@/lib/mock/phones';
import { STORES } from '@/lib/mock/stores';
import { getAddOnById } from '@/lib/mock/add-ons';
import type { UserProfile } from '@/lib/mock/types';

export const samplePlan = PLANS.find((plan) => plan.id === '35gb') ?? PLANS[0];
export const sampleYearlyPlan = PLANS.find((plan) => plan.billingPeriod === 'yearly') ?? PLANS[0];
export const samplePhone = PHONES[0];
export const sampleStore = STORES[0];
export const sampleAddOn = getAddOnById('extra-data-5gb');

export const sampleUser: UserProfile = {
  id: 'demo-user',
  email: 'demo@chatr.ca',
  firstName: 'Taylor',
  lastName: 'Singh',
  phone: '416-555-0142',
  address: '123 King St W',
  city: 'Toronto',
  province: 'ON',
  postalCode: 'M5V 2T6',
  username: 'demo',
  planId: samplePlan.id,
  balance: 45,
  anniversaryDate: '2026-08-01',
  autoPayEnabled: true,
  autoPayBonusClaimed: true,
  activeAddOns: [],
  paymentMethods: [
    {
      id: 'visa-4242',
      brand: 'Visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2028,
      isAutoPay: true,
    },
  ],
  transactions: [],
  usage: {
    dataUsedMb: 20480,
    dataLimitMb: 35840,
    minutesUsed: 120,
    minutesLimit: null,
    textsUsed: 340,
    textsLimit: null,
    cycleStart: '2026-06-01',
    cycleEnd: '2026-07-01',
    dailyDataMb: [120, 180, 90, 200, 150, 110, 95],
  },
};
