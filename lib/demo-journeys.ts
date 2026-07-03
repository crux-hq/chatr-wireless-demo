import type { DemoScenarioId } from './mock/types';

export type DemoJourney = {
  id: string;
  title: string;
  description: string;
  route: string;
  email?: string;
  password?: string;
  scenarioId?: DemoScenarioId;
  signOutFirst?: boolean;
};

/** Plain-English sales demo journeys with test credentials */
export const DEMO_JOURNEYS: DemoJourney[] = [
  {
    id: 'dashboard',
    title: 'Account dashboard',
    description: 'Home screen with balance, plan summary, usage ring, promos, and quick links.',
    route: '/(tabs)',
    email: 'demo@chatr.ca',
    password: 'any',
    scenarioId: 'happy-path',
  },
  {
    id: 'sign-in',
    title: 'Sign in',
    description: 'Log in to My chatr with a demo account.',
    route: '/(auth)/sign-in',
    email: 'demo@chatr.ca',
    password: 'any',
    signOutFirst: true,
  },
  {
    id: 'register',
    title: 'Create account',
    description: 'Register a new My chatr profile (mock — any details work).',
    route: '/(auth)/register',
    password: 'any',
    signOutFirst: true,
  },
  {
    id: 'activate',
    title: 'Activate new SIM',
    description: 'New customer wizard: enter SIM, pick plan, create account.',
    route: '/activate',
    email: 'new@chatr.ca',
    password: 'any',
    signOutFirst: true,
  },
  {
    id: 'browse-plans',
    title: 'Browse and compare plans',
    description: 'Filter plans, view 35 GB promo, FAQ, and plan details.',
    route: '/(tabs)/plans',
    email: 'demo@chatr.ca',
    password: 'any',
    scenarioId: 'happy-path',
  },
  {
    id: 'change-plan',
    title: 'Change plan',
    description: 'Open the featured 35 GB plan and confirm a plan change.',
    route: '/plan/35gb',
    email: 'demo@chatr.ca',
    password: 'any',
    scenarioId: 'plan-upgrade',
  },
  {
    id: 'usage',
    title: 'Usage monitoring',
    description: 'Data, talk, and text usage with charts and cycle dates.',
    route: '/(tabs)/usage',
    email: 'demo@chatr.ca',
    password: 'any',
    scenarioId: 'happy-path',
  },
  {
    id: 'usage-upsell',
    title: 'Usage alert — upsell data',
    description: '90% data used with alert banner and add-on CTA.',
    route: '/(tabs)/usage',
    email: 'heavy@chatr.ca',
    password: 'any',
    scenarioId: 'upsell-moment',
  },
  {
    id: 'top-up',
    title: 'Top up account',
    description: 'One-time payment amount picker and receipt.',
    route: '/top-up',
    email: 'demo@chatr.ca',
    password: 'any',
    scenarioId: 'happy-path',
  },
  {
    id: 'auto-pay',
    title: 'Auto-Pay and saved cards',
    description: 'Enroll in Auto-Pay, manage cards, view bonus data.',
    route: '/top-up/auto-pay',
    email: 'demo@chatr.ca',
    password: 'any',
    scenarioId: 'happy-path',
  },
  {
    id: 'addons',
    title: 'Add-ons marketplace',
    description: 'Roaming, international LD, extra data, and talk saver packs.',
    route: '/(tabs)/add-ons',
    email: 'roam@chatr.ca',
    password: 'any',
    scenarioId: 'roaming-trip',
  },
  {
    id: 'addon-purchase',
    title: 'Buy extra data add-on',
    description: 'Purchase flow for 5 GB extra data pack.',
    route: '/addons/extra-data-5gb',
    email: 'heavy@chatr.ca',
    password: 'any',
    scenarioId: 'upsell-moment',
  },
  {
    id: 'profile',
    title: 'Profile and settings',
    description: 'Account info, password, cards, MFA, in-store notices.',
    route: '/profile',
    email: 'demo@chatr.ca',
    password: 'any',
    scenarioId: 'happy-path',
  },
  {
    id: 'coverage',
    title: 'Coverage map',
    description: 'Nation-wide coverage by region across Canada.',
    route: '/coverage',
    email: 'demo@chatr.ca',
    password: 'any',
    scenarioId: 'happy-path',
  },
  {
    id: 'stores',
    title: 'Store locator',
    description: 'Find chatr stores with hours, directions, and call.',
    route: '/stores',
    email: 'demo@chatr.ca',
    password: 'any',
    scenarioId: 'happy-path',
  },
  {
    id: 'support',
    title: 'Support and FAQ',
    description: 'Searchable FAQ, mock chat, phone and store contact options.',
    route: '/support',
    email: 'demo@chatr.ca',
    password: 'any',
    scenarioId: 'happy-path',
  },
  {
    id: 'first-top-up',
    title: 'Just activated — first top-up',
    description: 'New account with zero balance ready for first payment.',
    route: '/top-up',
    email: 'new@chatr.ca',
    password: 'any',
    scenarioId: 'new-activation',
  },
];
