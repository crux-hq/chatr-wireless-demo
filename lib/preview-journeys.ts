import type { DemoScenarioId } from './mock/types';

export type PreviewStep = {
  title: string;
  highlight: string;
  /** URL path loaded in the device iframe (group segments stripped). */
  route: string;
};

export type PreviewJourney = {
  id: string;
  title: string;
  /** Applied before the journey starts so the app is in the right state. */
  scenarioId?: DemoScenarioId;
  signOutFirst?: boolean;
  steps: PreviewStep[];
};

/** Curated walkthrough journeys for the /preview presenter page. */
export const PREVIEW_JOURNEYS: PreviewJourney[] = [
  {
    id: 'dashboard',
    title: 'Account dashboard',
    scenarioId: 'happy-path',
    steps: [
      {
        title: 'Home at a glance',
        highlight:
          'Balance with Auto-Pay status, plan inclusions and a live data ring greet the customer the moment they sign in.',
        route: '/(tabs)',
      },
      {
        title: 'Usage monitoring',
        highlight:
          'Billing-cycle countdown, data, talk and text rings, plus a daily usage chart — all self-serve.',
        route: '/usage',
      },
      {
        title: 'Profile & settings',
        highlight: 'One hub for personal info, password and saved payment cards.',
        route: '/profile',
      },
    ],
  },
  {
    id: 'plans',
    title: 'Browse & buy a plan',
    signOutFirst: true,
    steps: [
      {
        title: 'Compare plans',
        highlight: 'Province-aware pricing, filters and plan cards with instant Get Plan actions.',
        route: '/plans',
      },
      {
        title: 'Plan details',
        highlight: 'Full inclusions with the +5 GB Auto-Pay bonus clearly called out.',
        route: '/plan/35gb',
      },
      {
        title: 'SIM checkout',
        highlight: 'Pick an eSIM with a compatibility check, or order a physical SIM to the door.',
        route: '/checkout/sim?planId=35gb',
      },
      {
        title: 'Choose a number',
        highlight: 'Select a new Canadian number or bring an existing one into the checkout.',
        route: '/checkout/phone-number?planId=35gb',
      },
      {
        title: 'Personal details',
        highlight: 'Name, email and shipping address for the order and account setup.',
        route: '/checkout/details',
      },
      {
        title: 'Payment method',
        highlight: 'Pay with a saved card or redeem a prepaid voucher / top-up PIN.',
        route: '/checkout/payment',
      },
      {
        title: 'Order review',
        highlight: 'Confirm SIM, number, customer details and payment before placing the order.',
        route: '/checkout/review',
      },
    ],
  },
  {
    id: 'activate',
    title: 'Activate a SIM',
    signOutFirst: true,
    steps: [
      {
        title: 'Start activation',
        highlight: 'Overview of the four-step wizard — order or enter a SIM, choose a plan, then create an account.',
        route: '/activate',
      },
      {
        title: 'Enter SIM',
        highlight: 'Enter the 19-digit SIM card number from the physical card or eSIM pack.',
        route: '/activate/sim',
      },
      {
        title: 'Select your plan',
        highlight: 'Pick a prepaid plan and optionally enable Auto-Pay for bonus data.',
        route: '/activate/plan',
      },
      {
        title: 'Create account',
        highlight: 'Set up the My chatr profile that will manage the newly activated line.',
        route: '/activate/account',
      },
      {
        title: 'Activation complete',
        highlight: 'Service is live — next steps include topping up and exploring the app.',
        route: '/activate/success',
      },
    ],
  },
  {
    id: 'top-up',
    title: 'Top-up & Auto-Pay',
    scenarioId: 'happy-path',
    steps: [
      {
        title: 'Top up in seconds',
        highlight: 'Amount picker and a one-time payment flow keep the prepaid balance healthy.',
        route: '/top-up',
      },
      {
        title: 'Enroll in Auto-Pay',
        highlight:
          'Overview of how Auto-Pay works, then confirm enrollment — payment on file is charged on the anniversary date.',
        route: '/top-up/auto-pay',
      },
    ],
  },
  {
    id: 'add-ons',
    title: 'Add-ons & upsell',
    scenarioId: 'upsell-moment',
    steps: [
      {
        title: 'Usage alert upsell',
        highlight: '90% of data used triggers an alert banner with a 5 GB add-on call to action.',
        route: '/usage',
      },
      {
        title: 'Browse add-ons',
        highlight: 'Roaming, international long distance, extra data and talk saver packs by category.',
        route: '/add-ons',
      },
      {
        title: 'Buy extra data',
        highlight: 'Add-on details with one-tap confirm and a success dialog.',
        route: '/addons/extra-data-5gb',
      },
    ],
  },
  {
    id: 'support',
    title: 'Coverage & support',
    scenarioId: 'happy-path',
    steps: [
      {
        title: 'Coverage map',
        highlight: 'Search any city or postal code with nationwide coverage layers.',
        route: '/coverage',
      },
      {
        title: 'Store locator',
        highlight: 'Nearby chatr stores with hours, directions and one-tap call.',
        route: '/stores',
      },
      {
        title: 'FAQ & support',
        highlight: 'Searchable FAQ by category with contact options as a fallback.',
        route: '/support',
      },
    ],
  },
];
