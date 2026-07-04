import type { DemoScenarioId } from './mock/types';

export type JourneyAudience = 'new' | 'existing';

export type JourneyTheme =
  | 'activation'
  | 'account'
  | 'plans'
  | 'usage'
  | 'billing'
  | 'auto-pay'
  | 'add-ons'
  | 'support';

export const JOURNEY_THEME_LABELS: Record<JourneyTheme, string> = {
  activation: 'Activation',
  account: 'Account',
  plans: 'Plans',
  usage: 'Usage',
  billing: 'Billing',
  'auto-pay': 'Auto-Pay',
  'add-ons': 'Add-ons',
  support: 'Support',
};

/** Themes shown as quick filters — order controls chip row */
export const JOURNEY_FILTER_THEMES: JourneyTheme[] = [
  'activation',
  'account',
  'plans',
  'usage',
  'billing',
  'auto-pay',
  'add-ons',
  'support',
];

export type DemoJourney = {
  id: string;
  title: string;
  description: string;
  route: string;
  email?: string;
  password?: string;
  scenarioId?: DemoScenarioId;
  signOutFirst?: boolean;
  audiences: JourneyAudience[];
  themes: JourneyTheme[];
};

/** Plain-English sales demo journeys with test credentials */
export const DEMO_JOURNEYS: DemoJourney[] = [
  {
    id: 'dashboard',
    title: 'Account dashboard',
    description:
      'Greeting, balance with Auto-Pay status, enroll-in-Auto-Pay promo, plan inclusions, data ring, quick links, and offers.',
    route: '/(tabs)',
    email: 'demo@chatr.ca',
    password: 'any',
    scenarioId: 'happy-path',
    audiences: ['existing'],
    themes: ['account', 'auto-pay'],
  },
  {
    id: 'sign-in',
    title: 'Sign in',
    description: 'Log in to My chatr with a demo account.',
    route: '/sign-in',
    email: 'demo@chatr.ca',
    password: 'any',
    signOutFirst: true,
    audiences: ['new', 'existing'],
    themes: ['account'],
  },
  {
    id: 'register',
    title: 'Create account',
    description: 'Register a new My chatr profile (mock — any details work).',
    route: '/register',
    password: 'any',
    signOutFirst: true,
    audiences: ['new'],
    themes: ['activation', 'account'],
  },
  {
    id: 'buy-sim',
    title: 'Buy a SIM card',
    description: 'Choose physical SIM ($10, free shipping) or eSIM (requires a plan). Physical SIM goes straight to checkout.',
    route: '/buy-sim',
    signOutFirst: true,
    audiences: ['new'],
    themes: ['activation'],
  },
  {
    id: 'activate',
    title: 'Activate new SIM',
    description: 'New customer wizard: SIM number, plan with optional Auto-Pay bonus, and account setup.',
    route: '/activate',
    email: 'new@chatr.ca',
    password: 'any',
    signOutFirst: true,
    audiences: ['new'],
    themes: ['activation'],
  },
  {
    id: 'browse-plans',
    title: 'Browse and compare plans',
    description:
      'Scrollable plan list with province selector, intro, filters, Get Plan, view details, and FAQ.',
    route: '/plans',
    signOutFirst: true,
    audiences: ['new', 'existing'],
    themes: ['plans'],
  },
  {
    id: 'plan-checkout',
    title: 'Get Plan — SIM checkout',
    description: 'Public checkout: pick eSIM (with compatibility check) or order a physical SIM for a plan.',
    route: '/checkout/sim?planId=35gb',
    signOutFirst: true,
    audiences: ['new'],
    themes: ['plans', 'activation'],
  },
  {
    id: 'change-plan',
    title: 'Change plan',
    description: 'Signed-in customer on 1 GB plan opens 35 GB details and confirms a plan change.',
    route: '/plan/35gb',
    email: 'new@chatr.ca',
    password: 'any',
    scenarioId: 'plan-upgrade',
    audiences: ['existing'],
    themes: ['plans'],
  },
  {
    id: 'usage',
    title: 'Usage monitoring',
    description:
      'Your plan summary, billing cycle, data ring, unlimited talk and text usage rings, and daily data chart.',
    route: '/(tabs)/usage',
    email: 'demo@chatr.ca',
    password: 'any',
    scenarioId: 'happy-path',
    audiences: ['existing'],
    themes: ['usage'],
  },
  {
    id: 'usage-upsell',
    title: 'Usage alert — upsell data',
    description: '90% data used with alert banner and 5 GB add-on CTA.',
    route: '/(tabs)/usage',
    email: 'heavy@chatr.ca',
    password: 'any',
    scenarioId: 'upsell-moment',
    audiences: ['existing'],
    themes: ['usage', 'add-ons'],
  },
  {
    id: 'top-up',
    title: 'Top up account',
    description: 'Top-up landing, amount picker, Auto-Pay info, and one-time payment flow.',
    route: '/top-up',
    email: 'demo@chatr.ca',
    password: 'any',
    scenarioId: 'happy-path',
    audiences: ['existing'],
    themes: ['billing'],
  },
  {
    id: 'auto-pay',
    title: 'Auto-Pay and saved cards',
    description: 'Enroll in Auto-Pay for +5 GB bonus data, toggle Auto-Pay, and manage saved cards.',
    route: '/top-up/auto-pay',
    email: 'demo@chatr.ca',
    password: 'any',
    scenarioId: 'happy-path',
    audiences: ['existing'],
    themes: ['auto-pay', 'billing'],
  },
  {
    id: 'addons',
    title: 'Add-ons marketplace',
    description: 'Browse roaming, international LD, extra data, and talk saver packs by category.',
    route: '/(tabs)/add-ons',
    email: 'roam@chatr.ca',
    password: 'any',
    scenarioId: 'roaming-trip',
    audiences: ['existing'],
    themes: ['add-ons'],
  },
  {
    id: 'addon-purchase',
    title: 'Buy extra data add-on',
    description: 'Add-on detail with All Add-ons breadcrumb, confirm purchase, and success dialog.',
    route: '/addons/extra-data-5gb',
    email: 'heavy@chatr.ca',
    password: 'any',
    scenarioId: 'upsell-moment',
    audiences: ['existing'],
    themes: ['add-ons', 'billing'],
  },
  {
    id: 'phones',
    title: 'Shop phones',
    description: 'Browse affordable phones, view specs and gallery, and link to TSC financing.',
    route: '/phones',
    signOutFirst: true,
    audiences: ['new', 'existing'],
    themes: ['support'],
  },
  {
    id: 'profile',
    title: 'Profile and settings',
    description:
      'Account hub for profile info, password, and payment cards — sub-pages include back to settings links.',
    route: '/profile',
    email: 'demo@chatr.ca',
    password: 'any',
    scenarioId: 'happy-path',
    audiences: ['existing'],
    themes: ['account'],
  },
  {
    id: 'coverage',
    title: 'Coverage map',
    description: 'Search by location or postal code with nationwide coverage layer filters.',
    route: '/coverage',
    email: 'demo@chatr.ca',
    password: 'any',
    scenarioId: 'happy-path',
    audiences: ['new', 'existing'],
    themes: ['support'],
  },
  {
    id: 'stores',
    title: 'Store locator',
    description: 'Find chatr stores with hours, directions, and call.',
    route: '/stores',
    email: 'demo@chatr.ca',
    password: 'any',
    scenarioId: 'happy-path',
    audiences: ['new', 'existing'],
    themes: ['support'],
  },
  {
    id: 'support',
    title: 'Support and FAQ',
    description: 'Searchable FAQ by category, contact options, and Auto-Pay enrolment callout.',
    route: '/support',
    email: 'demo@chatr.ca',
    password: 'any',
    scenarioId: 'happy-path',
    audiences: ['new', 'existing'],
    themes: ['support'],
  },
  {
    id: 'first-top-up',
    title: 'Just activated — first top-up',
    description: 'New account with zero balance ready for first payment.',
    route: '/top-up',
    email: 'new@chatr.ca',
    password: 'any',
    scenarioId: 'new-activation',
    audiences: ['new'],
    themes: ['activation', 'billing'],
  },
];

export function filterDemoJourneys(
  audience: JourneyAudience,
  activeThemes: JourneyTheme[],
  searchQuery = '',
): DemoJourney[] {
  const query = searchQuery.trim().toLowerCase();

  return DEMO_JOURNEYS.filter((journey) => {
    const matchesAudience = journey.audiences.includes(audience);
    const matchesTheme =
      activeThemes.length === 0 || journey.themes.some((theme) => activeThemes.includes(theme));
    if (!matchesAudience || !matchesTheme) return false;
    if (!query) return true;

    const haystack = [
      journey.title,
      journey.description,
      journey.id,
      journey.email ?? '',
      ...journey.themes.map((theme) => JOURNEY_THEME_LABELS[theme]),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function getThemesForAudience(audience: JourneyAudience): JourneyTheme[] {
  const themes = new Set<JourneyTheme>();
  for (const journey of DEMO_JOURNEYS) {
    if (journey.audiences.includes(audience)) {
      journey.themes.forEach((theme) => themes.add(theme));
    }
  }
  return JOURNEY_FILTER_THEMES.filter((theme) => themes.has(theme));
}
