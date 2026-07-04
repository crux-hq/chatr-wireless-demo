import { router, type Href } from 'expo-router';
import { DEMO_JOURNEYS } from '@/lib/demo-journeys';
import { isAuthJourneyId, navigateAuthJourney } from '@/lib/nav-auth';
import { useAppStore } from '@/lib/store';

/** Logged-out destinations for marketing homepage links */
const PUBLIC_HOMEPAGE_ROUTES: Record<string, string> = {
  activate: '/activate',
  'buy-sim': '/buy-sim',
  'browse-plans': '/plans',
  'browse-phones': '/phones',
  'change-plan': '/plan/35gb',
  coverage: '/coverage',
  stores: '/stores',
  support: '/support',
  addons: '/add-ons',
  'addon-purchase': '/addons/extra-data-5gb',
  'top-up': '/top-up',
  'auto-pay': '/top-up/auto-pay',
  'first-top-up': '/top-up',
};

export function navigateToPublicPlans() {
  launchPublicJourney('browse-plans');
}

export function startPlanCheckoutAndNavigate(planId: string) {
  useAppStore.getState().startPlanCheckout(planId);
  router.push(`/checkout/sim?planId=${planId}` as Href);
}

/** Sign out and open a public route — never auto-signs in (except sign-in / register). */
export function launchPublicJourney(journeyId: string) {
  if (isAuthJourneyId(journeyId)) {
    navigateAuthJourney(journeyId);
    return;
  }

  useAppStore.getState().signOut();

  const route =
    PUBLIC_HOMEPAGE_ROUTES[journeyId] ??
    DEMO_JOURNEYS.find((j) => j.id === journeyId)?.route ??
    '/home';

  router.push(route as Href);
}

export function isPublicHomepageRoute(route: string): boolean {
  return Object.values(PUBLIC_HOMEPAGE_ROUTES).includes(route);
}
