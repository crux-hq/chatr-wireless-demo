import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/lib/i18n';
import type { DemoScenarioId, UserProfile } from '../mock/types';
import { getUserForScenario, getUserByEmail } from '../demo-scenarios';
import { mockApiCall } from '../mock/api';
import { getPlanById } from '../mock/plans';
import { getAddOnById } from '../mock/add-ons';

type AppState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  locale: 'en' | 'fr';
  currentScenario: DemoScenarioId;
  selectedPlanId: string | null;
  pendingPlanChangeId: string | null;
  pendingAddOnId: string | null;
  activationDraft: {
    simNumber: string;
    phoneNumber: string;
    planId: string;
    autoPay: boolean;
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
  confirmPlanChange: () => Promise<void>;
  topUp: (amount: number) => Promise<void>;
  toggleAutoPay: (enabled: boolean) => void;
  claimAutoPayBonus: () => Promise<void>;
  addPaymentMethod: (card: { brand: string; last4: string; expiryMonth: number; expiryYear: number; isAutoPay: boolean }) => void;
  removePaymentMethod: (id: string) => void;
  purchaseAddOn: (addOnId: string) => Promise<{ expiresAt: string } | null>;
  setPendingAddOn: (addOnId: string | null) => void;
  resetDemoState: () => Promise<void>;
  setActivationDraft: (updates: Partial<AppState['activationDraft']>) => void;
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
  activationDraft: {
    simNumber: '',
    phoneNumber: '',
    planId: '35gb',
    autoPay: true,
  },

  persist: async () => {
    const { locale, currentScenario, isAuthenticated, user } = get();
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ locale, currentScenario, isAuthenticated, userEmail: user?.email }),
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
        if (saved.isAuthenticated && saved.userEmail) {
          const user = getUserByEmail(saved.userEmail);
          if (user) set({ isAuthenticated: true, user });
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

  confirmPlanChange: async () => {
    const { user, pendingPlanChangeId } = get();
    if (!user || !pendingPlanChangeId) return;
    const plan = getPlanById(pendingPlanChangeId);
    if (!plan) return;
    await mockApiCall(null);
    const dataLimitMb =
      (plan.baseDataGb + (user.autoPayEnabled && (user.autoPayBonusClaimed ?? false) ? plan.autoPayBonusGb : 0)) * 1024;
    set({
      user: {
        ...user,
        planId: pendingPlanChangeId,
        balance: plan.price,
        autoPayBonusClaimed: false,
        usage: { ...user.usage, dataLimitMb },
      },
      pendingPlanChangeId: null,
    });
    void get().persist();
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
    const bonusMb = plan && enabled && (user.autoPayBonusClaimed ?? false) ? plan.autoPayBonusGb * 1024 : 0;
    const baseMb = plan ? plan.baseDataGb * 1024 : user.usage.dataLimitMb;
    set({
      user: {
        ...user,
        autoPayEnabled: enabled,
        usage: { ...user.usage, dataLimitMb: baseMb + bonusMb },
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

  resetDemoState: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({
      isAuthenticated: false,
      user: null,
      currentScenario: 'happy-path',
      selectedPlanId: null,
      pendingPlanChangeId: null,
      pendingAddOnId: null,
      activationDraft: {
        simNumber: '',
        phoneNumber: '',
        planId: '35gb',
        autoPay: true,
      },
    });
  },

  setActivationDraft: (updates) => {
    set({ activationDraft: { ...get().activationDraft, ...updates } });
  },

  completeActivation: async (profile) => {
    const { activationDraft } = get();
    const plan = getPlanById(activationDraft.planId);
    const dataLimitMb = plan
      ? (plan.baseDataGb + (activationDraft.autoPay ? plan.autoPayBonusGb : 0)) * 1024
      : 1024;
    const user: UserProfile = {
      id: `user-${Date.now()}`,
      email: profile.email ?? 'new@chatr.ca',
      firstName: profile.firstName ?? 'New',
      lastName: profile.lastName ?? 'User',
      phone: activationDraft.phoneNumber || profile.phone || '416-555-0000',
      address: '',
      city: '',
      province: 'ON',
      postalCode: '',
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
