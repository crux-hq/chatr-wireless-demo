export type PlanCategory = 'talk-text-data' | 'talk-text';

export type Plan = {
  id: string;
  nameEn: string;
  nameFr: string;
  price: number;
  baseDataGb: number;
  autoPayBonusGb: number;
  talkEn: string;
  talkFr: string;
  textEn: string;
  textFr: string;
  category: PlanCategory;
  featured?: boolean;
};

export type AddOnCategory =
  | 'roaming'
  | 'international-ld'
  | 'extra-data'
  | 'talk-saver'
  | 'us-roaming-text';

export type AddOn = {
  id: string;
  category: AddOnCategory;
  nameEn: string;
  nameFr: string;
  descriptionEn: string;
  descriptionFr: string;
  price: number;
  destinations?: string[];
  dataGb?: number;
  minutes?: number;
};

export type ActiveAddOn = {
  addOnId: string;
  purchasedAt: string;
  expiresAt: string;
};

export type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isAutoPay: boolean;
};

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: 'top-up' | 'plan' | 'add-on' | 'auto-pay';
  descriptionEn: string;
  descriptionFr: string;
};

export type Usage = {
  dataUsedMb: number;
  dataLimitMb: number;
  minutesUsed: number;
  minutesLimit: number | null;
  textsUsed: number;
  textsLimit: number | null;
  cycleStart: string;
  cycleEnd: string;
  dailyDataMb: number[];
};

export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  username: string;
  planId: string;
  balance: number;
  anniversaryDate: string;
  autoPayEnabled: boolean;
  autoPayBonusClaimed: boolean;
  activeAddOns: ActiveAddOn[];
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
  usage: Usage;
};

export type DemoScenarioId =
  | 'new-activation'
  | 'happy-path'
  | 'upsell-moment'
  | 'roaming-trip'
  | 'plan-upgrade';

export type StoreType = 'chatr' | 'retail-partner';
export type RetailCategory = 'grocery' | 'drug' | 'gas' | 'convenience';

export type Store = {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  lat: number;
  lng: number;
  hoursEn: string;
  hoursFr: string;
  phone: string;
  storeType: StoreType;
  retailCategory?: RetailCategory;
  sellsSim?: boolean;
  sellsTopUp?: boolean;
};

export type FaqItem = {
  id: string;
  questionEn: string;
  questionFr: string;
  answerEn: string;
  answerFr: string;
};

export type Promo = {
  id: string;
  titleEn: string;
  titleFr: string;
  subtitleEn: string;
  subtitleFr: string;
  ctaEn: string;
  ctaFr: string;
  route: string;
};
