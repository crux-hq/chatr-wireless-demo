import type { UserProfile } from './types';

const CYCLE_START = '2026-06-02';
const CYCLE_END = '2026-07-02';
const ANNIVERSARY = '2026-07-02';

function makeUsage(
  dataUsedMb: number,
  dataLimitMb: number,
  minutesUsed = 120,
  minutesLimit: number | null = null,
  textsUsed = 450,
): UserProfile['usage'] {
  return {
    dataUsedMb,
    dataLimitMb,
    minutesUsed,
    minutesLimit,
    textsUsed,
    textsLimit: minutesLimit ? null : null,
    cycleStart: CYCLE_START,
    cycleEnd: CYCLE_END,
    dailyDataMb: [320, 410, 280, 550, 620, 390, 480, 510, 440, 380, 290, 670, 520, 430],
  };
}

export const DEMO_USERS: Record<string, UserProfile> = {
  'demo@chatr.ca': {
    id: 'user-demo',
    email: 'demo@chatr.ca',
    firstName: 'Alex',
    lastName: 'Martin',
    phone: '416-555-7890',
    address: '123 Queen St W',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M5H 2M9',
    username: 'alexmartin',
    planId: '35gb',
    balance: 29.0,
    anniversaryDate: ANNIVERSARY,
    autoPayEnabled: false,
    autoPayBonusClaimed: false,
    activeAddOns: [],
    paymentMethods: [
      {
        id: 'card-1',
        brand: 'Visa',
        last4: '4242',
        expiryMonth: 8,
        expiryYear: 2028,
        isAutoPay: false,
      },
    ],
    transactions: [
      {
        id: 'tx-1',
        date: '2026-06-02',
        amount: 29,
        type: 'auto-pay',
        descriptionEn: 'Auto-Pay — 35 GB Plan',
        descriptionFr: 'Paiement auto — Forfait 35 Go',
      },
      {
        id: 'tx-2',
        date: '2026-05-02',
        amount: 29,
        type: 'auto-pay',
        descriptionEn: 'Auto-Pay — 35 GB Plan',
        descriptionFr: 'Paiement auto — Forfait 35 Go',
      },
    ],
    usage: makeUsage(18_432, 30 * 1024),
  },
  'heavy@chatr.ca': {
    id: 'user-heavy',
    email: 'heavy@chatr.ca',
    firstName: 'Jordan',
    lastName: 'Chen',
    phone: '604-555-3210',
    address: '456 Granville St',
    city: 'Vancouver',
    province: 'BC',
    postalCode: 'V6C 1V5',
    username: 'jordanchen',
    planId: '25gb',
    balance: 25.0,
    anniversaryDate: ANNIVERSARY,
    autoPayEnabled: true,
    autoPayBonusClaimed: false,
    activeAddOns: [],
    paymentMethods: [
      {
        id: 'card-1',
        brand: 'Mastercard',
        last4: '5555',
        expiryMonth: 3,
        expiryYear: 2027,
        isAutoPay: true,
      },
    ],
    transactions: [],
    usage: makeUsage(23_040, 25 * 1024),
  },
  'roam@chatr.ca': {
    id: 'user-roam',
    email: 'roam@chatr.ca',
    firstName: 'Sophie',
    lastName: 'Dupont',
    phone: '514-555-9876',
    address: '789 Rue Sainte-Catherine',
    city: 'Montreal',
    province: 'QC',
    postalCode: 'H3B 1B3',
    username: 'sophiedupont',
    planId: '35gb',
    balance: 44.0,
    anniversaryDate: ANNIVERSARY,
    autoPayEnabled: true,
    autoPayBonusClaimed: false,
    activeAddOns: [
      {
        addOnId: 'roaming-eu-3gb',
        purchasedAt: '2026-06-20',
        expiresAt: '2026-07-20',
      },
    ],
    paymentMethods: [
      {
        id: 'card-1',
        brand: 'Visa',
        last4: '1234',
        expiryMonth: 11,
        expiryYear: 2029,
        isAutoPay: true,
      },
    ],
    transactions: [
      {
        id: 'tx-roam',
        date: '2026-06-20',
        amount: 25,
        type: 'add-on',
        descriptionEn: 'Europe Data Roaming 3 GB',
        descriptionFr: 'Itinérance données Europe 3 Go',
      },
    ],
    usage: makeUsage(12_288, 35 * 1024),
  },
  'new@chatr.ca': {
    id: 'user-new',
    email: 'new@chatr.ca',
    firstName: 'Taylor',
    lastName: 'Singh',
    phone: '403-555-4567',
    address: '100 8 Ave SW',
    city: 'Calgary',
    province: 'AB',
    postalCode: 'T2P 1B4',
    username: 'taylorsingh',
    planId: '1gb',
    balance: 0,
    anniversaryDate: ANNIVERSARY,
    autoPayEnabled: false,
    autoPayBonusClaimed: false,
    activeAddOns: [],
    paymentMethods: [],
    transactions: [],
    usage: makeUsage(0, 1 * 1024),
  },
};

export const DEMO_PERSONAS = [
  { email: 'demo@chatr.ca', labelEn: 'Standard user', labelFr: 'Utilisateur standard' },
  { email: 'heavy@chatr.ca', labelEn: '90% data used', labelFr: '90 % des données utilisées' },
  { email: 'roam@chatr.ca', labelEn: 'Roaming traveler', labelFr: 'Voyageur en itinérance' },
  { email: 'new@chatr.ca', labelEn: 'Just activated', labelFr: 'Récemment activé' },
];

export function cloneUser(user: UserProfile): UserProfile {
  return JSON.parse(JSON.stringify(user));
}
