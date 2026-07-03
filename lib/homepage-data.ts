export const HERO_BADGE = "Canada's #1 Prepaid Mobile Phone Provider";

export const HERO_SLIDES = [
  {
    id: '50gb',
    title: 'Get 50GB of Data and Unlimited US Calling for $34!!*',
    subtitle: 'Plus, enjoy unlimited data for the rest of your billing cycle.',
    image: require('@/assets/images/homepage/hero-speech.png'),
    shopJourneyId: 'browse-plans',
    detailsJourneyId: 'change-plan',
  },
  {
    id: '2gb',
    title: '2GB of data — for $10!',
    subtitle: 'A simple add-on to keep you connected when you need it.',
    image: require('@/assets/images/homepage/promo-phone.png'),
    shopJourneyId: 'browse-plans',
    detailsJourneyId: 'addon-purchase',
  },
] as const;

export const PROMO_CARDS = [
  {
    id: 'sim',
    icon: require('@/assets/images/homepage/icon-sim.png'),
    title: 'Get a new Sim today',
    body: 'Order a SIM card online or at a store near you.',
    cta: 'Shop SIM',
    journeyId: 'activate',
  },
  {
    id: 'topup',
    icon: require('@/assets/images/homepage/icon-wallet.png'),
    title: 'Top-up your account',
    body: 'Add funds to your account quickly and easily.',
    cta: 'Top up now',
    journeyId: 'top-up',
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Order your SIM card',
    body: 'Order a SIM card online or at a store near you.',
    cta: 'Get started',
    journeyId: 'activate',
  },
  {
    step: 2,
    title: 'Pick your plan',
    body: 'Browse affordable plans with no credit checks or contracts.',
    cta: 'View plans',
    journeyId: 'browse-plans',
  },
  {
    step: 3,
    title: 'Activate and top up',
    body: 'Activate your SIM, add funds, and start using chatr right away.',
    cta: 'Activate now',
    journeyId: 'activate',
  },
] as const;

export const WHY_CHATR_ITEMS = [
  { id: 'credit', title: 'No credit checks', body: 'Get connected without a credit check — everyone is welcome at chatr.' },
  { id: 'contracts', title: 'No term contracts', body: 'Stay flexible with prepaid plans you can change anytime.' },
  { id: 'hidden', title: 'No hidden charges', body: 'What you see is what you pay. No surprise fees on your bill.' },
  {
    id: 'affordable',
    title: 'Affordable',
    body: 'Plans starting from just $10/month with bonus data on Auto-Pay.',
  },
] as const;

export const TESTIMONIALS = [
  {
    id: '1',
    quote:
      'I am very happy with the Chatr product. It\'s easy to use and the customer service is very helpful.',
    name: 'John Doe',
    role: 'Student',
    avatar: require('@/assets/images/homepage/testimonial-avatar.png'),
    rating: 5,
  },
  {
    id: '2',
    quote: 'Switching to chatr was simple. Great coverage and the app makes topping up effortless.',
    name: 'Marie L.',
    role: 'Customer',
    avatar: require('@/assets/images/homepage/testimonial-avatar.png'),
    rating: 5,
  },
] as const;

export const COVERAGE_FEATURES = [
  { id: 'nationwide', title: 'Nationwide coverage', body: 'Reliable service across Canada.' },
  { id: 'reliable', title: 'Reliable connection', body: 'Stay connected where it matters most.' },
] as const;

export const HOMEPAGE_FAQ = [
  {
    id: 'activate-sim',
    question: 'How do I activate a SIM card?',
    answer:
      'Insert your chatr SIM, then follow the activation wizard in the app or online. You\'ll pick a plan and create your My chatr account.',
    journeyId: 'activate',
  },
  {
    id: 'roaming',
    question: 'Can I use Chatr while traveling abroad?',
    answer:
      'Yes — add a roaming travel pack from the add-ons marketplace before you travel. Manage everything from My chatr.',
    journeyId: 'addons',
  },
  {
    id: 'payment',
    question: 'What are the available payment methods?',
    answer:
      'Top up with Visa, Mastercard, or American Express. Enroll in Auto-Pay for bonus data and hassle-free renewals.',
    journeyId: 'auto-pay',
  },
  {
    id: 'change-plan',
    question: 'How do I change my Chatr plan?',
    answer:
      'Sign in to My chatr, browse plans, and confirm your new plan. Changes take effect on your next billing cycle.',
    journeyId: 'change-plan',
  },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { label: 'Plans', journeyId: 'browse-plans' },
    { label: 'Phones', journeyId: 'browse-plans' },
    { label: 'SIM cards', journeyId: 'activate' },
  ],
  support: [
    { label: 'Help center', journeyId: 'support' },
    { label: 'Contact us', journeyId: 'support' },
    { label: 'Store locator', journeyId: 'stores' },
  ],
  myChatr: [
    { label: 'Login', journeyId: 'sign-in' },
    { label: 'Register', journeyId: 'register' },
    { label: 'Top-up', journeyId: 'top-up' },
  ],
  about: [
    { label: 'About us', journeyId: 'support' },
    { label: 'Careers', journeyId: 'support' },
    { label: 'Legal', journeyId: 'support' },
  ],
} as const;
