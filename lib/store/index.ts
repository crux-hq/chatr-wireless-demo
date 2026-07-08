import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/lib/i18n';
import type { CartLineItem, DemoScenarioId, SimType, UserProfile } from '../mock/types';
import { DEFAULT_PROVINCE_CODE, type ProvinceCode } from '../mock/provinces';
import { getCartProduct } from '../mock/cart-products';
import { getUserForScenario, getUserByEmail } from '../demo-scenarios';
import { mockApiCall } from '../mock/api';
import { getPlanById, getTotalDataGb } from '../mock/plans';
import { getAddOnById } from '../mock/add-ons';
import { EMPTY_CUSTOMER_DETAILS, type CheckoutCustomerDetails } from '../checkout';

type AppState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  locale: 'en' | 'fr';
  currentScenario: DemoScenarioId;
  selectedPlanId: string | null;
  pendingPlanChangeId: string | null;
  pendingAddOnId: string | null;
  cart: CartLineItem[];
  plansProvince: ProvinceCode;
  activationDraft: {
    simNumber: string;
    phoneNumber: string;
    phoneNumberMode: 'new' | 'port';
    paymentMethodId: string | null;
    planId: string;
    autoPay: boolean;
    simType: SimType | null;
    checkoutMode: 'plan' | 'sim-only';
    physicalSimOnly: boolean;
    customerDetails: CheckoutCustomerDetails;
  };

  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
  setLocale: (locale: 'en' | 'fr') => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  applyScenario: (scenarioId: DemoScenarioId) => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => void;
  setSelectedPlan: (planId: string) => void;
  setPendingPlanChange: (planId: string | null) => void;
  confirmPlanChange: (planId?: string) => Promise<boolean>;
  topUp: (amount: number) => Promise<void>;
  toggleAutoPay: (enabled: boolean) => void;
  claimAutoPayBonus: () => Promise<void>;
  addPaymentMethod: (card: { brand: string; last4: string; expiryMonth: number; expiryYear: number; isAutoPay: boolean }) => void;
  removePaymentMethod: (id: string) => void;
  purchaseAddOn: (addOnId: string) => Promise<{ expiresAt: string } | null>;
  setPendingAddOn: (addOnId: string | null) => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setPlansProvince: (province: ProvinceCode) => void;
  resetDemoState: () => Promise<void>;
  setActivationDraft: (updates: Partial<AppState['activationDraft']>) => void;
  startPlanCheckout: (planId: string) => void;
  startPhysicalSimCheckout: () => void;
  completeActivation: (profile: Partial<UserProfile>) => Promise<void>;
};

const STORAGE_KEY = 'chatr-demo-state';

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  locale: 'en',
  currentScenario: 'happy-path',
  selectedPlanId: null,
  pendingPlanChangeId: null,
  pendingAddOnId: null,
  cart: [],
  plansProvince: DEFAULT_PROVINCE_CODE,
  activationDraft: {
    simNumber: '',
    phoneNumber: '',
    phoneNumberMode: 'new',
    paymentMethodId: null,
    planId: '35gb',
    autoPay: true,
    simType: null,
    checkoutMode: 'plan',
    physicalSimOnly: false,
    customerDetails: { ...EMPTY_CUSTOMER_DETAILS },
  },

  persist: async () => {
    const { locale, currentScenario, isAuthenticated, user, cart, plansProvince } = get();
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ locale, currentScenario, isAuthenticated, userEmail: user?.email, user, cart, plansProvince }),
    );
  },

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.locale) {
          set({ locale: saved.locale });
          void i18n.changeLanguage(saved.locale);
        }
        if (saved.currentScenario) set({ currentScenario: saved.currentScenario });
        if (Array.isArray(saved.cart)) set({ cart: saved.cart as CartLineItem[] });
        if (saved.plansProvince) set({ plansProvince: saved.plansProvince as ProvinceCode });
        if (saved.isAuthenticated && saved.user) {
          set({ isAuthenticated: true, user: saved.user as UserProfile });
        } else if (saved.isAuthenticated && saved.userEmail) {
          const user = getUserByEmail(saved.userEmail);
          if (user) set({ isAuthenticated: true, user });
        }
      }

      // Device iframe only: parent /preview queues scenario/sign-out via sessionStorage.
      // Skip when this window is the presenter shell (path /preview), even if nested in Cursor's browser frame.
      if (typeof window !== 'undefined' && window.self !== window.top) {
        const path = window.location.pathname.replace(/\/$/, '') || '/';
        if (path !== '/preview') {
          const { consumePreviewBootstrap } = await import('@/lib/preview-frame');
          const bootstrap = consumePreviewBootstrap();
          if (bootstrap?.signOutFirst) {
            set({ isAuthenticated: false, user: null });
          }
          if (bootstrap?.scenarioId) {
            const user = getUserForScenario(bootstrap.scenarioId);
            set({ isAuthenticated: true, user, currentScenario: bootstrap.scenarioId });
          }
          if (bootstrap?.signOutFirst || bootstrap?.scenarioId) {
            void get().persist();
          }
        }
      }
    } finally {
      set({ isLoading: false });
    }
  },

  setLocale: (locale) => {
    set({ locale });
    void i18n.changeLanguage(locale);
    void get().persist();
  },

  signIn: async (email) => {
    set({ isLoading: true });
    const user = await mockApiCall(getUserByEmail(email.toLowerCase()) ?? getUserForScenario('happy-path'));
    set({ isAuthenticated: true, user, isLoading: false });
    void get().persist();
    return true;
  },

  signOut: () => {
    set({ isAuthenticated: false, user: null });
    void get().persist();
  },

  applyScenario: async (scenarioId) => {
    set({ isLoading: true, currentScenario: scenarioId });
    const user = await mockApiCall(getUserForScenario(scenarioId));
    set({ isAuthenticated: true, user, isLoading: false });
    void get().persist();
  },

  updateUser: (updates) => {
    const { user } = get();
    if (!user) return;
    set({ user: { ...user, ...updates } });
    void get().persist();
  },

  setSelectedPlan: (planId) => set({ selectedPlanId: planId }),

  setPendingPlanChange: (planId) => set({ pendingPlanChangeId: planId }),

  confirmPlanChange: async (planId) => {
    const { user, pendingPlanChangeId } = get();
    const targetPlanId = planId ?? pendingPlanChangeId;
    if (!user || !targetPlanId) return false;
    if (user.planId === targetPlanId) return false;
    const plan = getPlanById(targetPlanId);
    if (!plan) return false;
    await mockApiCall(null);
    const dataLimitMb = getTotalDataGb(plan, user.autoPayEnabled) * 1024;
    set({
      user: {
        ...user,
        planId: targetPlanId,
        balance: plan.price,
        autoPayBonusClaimed: false,
        usage: { ...user.usage, dataLimitMb },
      },
      pendingPlanChangeId: null,
    });
    void get().persist();
    return true;
  },

  topUp: async (amount) => {
    const { user } = get();
    if (!user) return;
    await mockApiCall(null);
    set({
      user: {
        ...user,
        balance: user.balance + amount,
        transactions: [
          {
            id: `tx-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            amount,
            type: 'top-up',
            descriptionEn: 'One-time top-up',
            descriptionFr: 'Recharge unique',
          },
          ...user.transactions,
        ],
      },
    });
    void get().persist();
  },

  toggleAutoPay: (enabled) => {
    const { user } = get();
    if (!user) return;
    const plan = getPlanById(user.planId);
    const baseMb = plan ? plan.baseDataGb * 1024 : user.usage.dataLimitMb;
    let autoPayBonusClaimed = user.autoPayBonusClaimed ?? false;
    let dataLimitMb = baseMb;

    if (enabled && plan) {
      if (plan.autoPayBonusGb > 0 && !autoPayBonusClaimed) {
        autoPayBonusClaimed = true;
      }
      if (autoPayBonusClaimed && plan.autoPayBonusGb > 0) {
        dataLimitMb = baseMb + plan.autoPayBonusGb * 1024;
      }
    }

    set({
      user: {
        ...user,
        autoPayEnabled: enabled,
        autoPayBonusClaimed: enabled ? autoPayBonusClaimed : false,
        usage: { ...user.usage, dataLimitMb },
      },
    });
    void get().persist();
  },

  claimAutoPayBonus: async () => {
    const { user } = get();
    if (!user || (user.autoPayBonusClaimed ?? false)) return;
    const plan = getPlanById(user.planId);
    if (!plan || plan.autoPayBonusGb <= 0) return;
    await mockApiCall(null);
    set({
      user: {
        ...user,
        autoPayEnabled: true,
        autoPayBonusClaimed: true,
        usage: {
          ...user.usage,
          dataLimitMb: user.usage.dataLimitMb + plan.autoPayBonusGb * 1024,
        },
      },
    });
    void get().persist();
  },

  addPaymentMethod: (card) => {
    const { user } = get();
    if (!user) return;
    const newCard = { ...card, id: `card-${Date.now()}` };
    set({
      user: {
        ...user,
        paymentMethods: [
          ...user.paymentMethods.map((c) => ({ ...c, isAutoPay: card.isAutoPay ? false : c.isAutoPay })),
          newCard,
        ],
      },
    });
    void get().persist();
  },

  removePaymentMethod: (id) => {
    const { user } = get();
    if (!user) return;
    set({ user: { ...user, paymentMethods: user.paymentMethods.filter((c) => c.id !== id) } });
    void get().persist();
  },

  purchaseAddOn: async (addOnId) => {
    const { user } = get();
    if (!user) return null;
    const addOn = getAddOnById(addOnId);
    if (!addOn) return null;
    await mockApiCall(null);
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    const purchasedAt = new Date().toISOString().split('T')[0];
    const expiresAt = expires.toISOString().split('T')[0];
    let usage = { ...user.usage };
    if (addOn.dataGb && addOn.category === 'extra-data') {
      usage = { ...usage, dataLimitMb: usage.dataLimitMb + addOn.dataGb * 1024 };
    }
    set({
      user: {
        ...user,
        balance: user.balance - addOn.price,
        usage,
        activeAddOns: [
          ...user.activeAddOns,
          {
            addOnId,
            purchasedAt,
            expiresAt,
          },
        ],
        transactions: [
          {
            id: `tx-${Date.now()}`,
            date: purchasedAt,
            amount: addOn.price,
            type: 'add-on',
            descriptionEn: addOn.nameEn,
            descriptionFr: addOn.nameFr,
          },
          ...user.transactions,
        ],
      },
    });
    void get().persist();
    return { expiresAt };
  },

  setPendingAddOn: (addOnId) => {
    set({ pendingAddOnId: addOnId });
  },

  addToCart: (productId) => {
    if (!getCartProduct(productId)) return;
    const { cart } = get();
    const existing = cart.find((item) => item.productId === productId);
    const nextCart = existing
      ? cart.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      : [...cart, { productId, quantity: 1 }];
    set({ cart: nextCart });
    void get().persist();
  },

  removeFromCart: (productId) => {
    set({ cart: get().cart.filter((item) => item.productId !== productId) });
    void get().persist();
  },

  clearCart: () => {
    set({ cart: [] });
    void get().persist();
  },

  setPlansProvince: (province) => {
    set({ plansProvince: province });
    void get().persist();
  },

  resetDemoState: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({
      isAuthenticated: false,
      user: null,
      currentScenario: 'happy-path',
      selectedPlanId: null,
      pendingPlanChangeId: null,
      pendingAddOnId: null,
      cart: [],
      plansProvince: DEFAULT_PROVINCE_CODE,
      activationDraft: {
        simNumber: '',
        phoneNumber: '',
        phoneNumberMode: 'new',
        paymentMethodId: null,
        planId: '35gb',
        autoPay: true,
        simType: null,
        checkoutMode: 'plan',
        physicalSimOnly: false,
        customerDetails: { ...EMPTY_CUSTOMER_DETAILS },
      },
    });
  },

  setActivationDraft: (updates) => {
    set({ activationDraft: { ...get().activationDraft, ...updates } });
  },

  startPlanCheckout: (planId) => {
    set({
      selectedPlanId: planId,
      activationDraft: {
        ...get().activationDraft,
        checkoutMode: 'plan',
        physicalSimOnly: false,
        planId,
        simType: null,
        phoneNumber: '',
        phoneNumberMode: 'new',
        paymentMethodId: null,
        customerDetails: { ...EMPTY_CUSTOMER_DETAILS },
      },
    });
    void get().persist();
  },

  startPhysicalSimCheckout: () => {
    set({
      selectedPlanId: null,
      activationDraft: {
        ...get().activationDraft,
        checkoutMode: 'sim-only',
        physicalSimOnly: true,
        simType: 'physical-order',
        phoneNumber: '',
        phoneNumberMode: 'new',
        paymentMethodId: null,
        customerDetails: { ...EMPTY_CUSTOMER_DETAILS },
      },
    });
    void get().persist();
  },

  completeActivation: async (profile) => {
    const { activationDraft } = get();
    const plan = getPlanById(activationDraft.planId);
    const dataLimitMb = plan
      ? (plan.baseDataGb + (activationDraft.autoPay ? plan.autoPayBonusGb : 0)) * 1024
      : 1024;
    const details = activationDraft.customerDetails;
    const user: UserProfile = {
      id: `user-${Date.now()}`,
      email: details.email || profile.email || 'new@chatr.ca',
      firstName: details.firstName || profile.firstName || 'New',
      lastName: details.lastName || profile.lastName || 'User',
      phone: activationDraft.phoneNumber || profile.phone || '416-555-0000',
      address: details.address,
      city: details.city,
      province: details.province || 'ON',
      postalCode: details.postalCode,
      username: profile.email?.split('@')[0] ?? 'newuser',
      planId: activationDraft.planId,
      balance: 0,
      anniversaryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      autoPayEnabled: activationDraft.autoPay,
      autoPayBonusClaimed: activationDraft.autoPay,
      activeAddOns: [],
      paymentMethods: [],
      transactions: [],
      usage: {
        dataUsedMb: 0,
        dataLimitMb,
        minutesUsed: 0,
        minutesLimit: plan?.category === 'talk-text' ? 400 : null,
        textsUsed: 0,
        textsLimit: null,
        cycleStart: new Date().toISOString().split('T')[0],
        cycleEnd: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        dailyDataMb: [],
      },
    };
    await mockApiCall(null);
    set({ isAuthenticated: true, user });
    void get().persist();
  },
}));

export function useLocalizedPlan(plan: { nameEn: string; nameFr: string; talkEn: string; talkFr: string; textEn: string; textFr: string }) {
  const locale = useAppStore((s) => s.locale);
  return {
    name: locale === 'fr' ? plan.nameFr : plan.nameEn,
    talk: locale === 'fr' ? plan.talkFr : plan.talkEn,
    text: locale === 'fr' ? plan.textFr : plan.textEn,
  };
}

export function useDataUsagePercent(user: UserProfile | null): number {
  if (!user || user.usage.dataLimitMb === 0) return 0;
  return Math.round((user.usage.dataUsedMb / user.usage.dataLimitMb) * 100);
}
