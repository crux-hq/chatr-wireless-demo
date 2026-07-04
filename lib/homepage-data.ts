export const HERO_BADGE_KEY = 'homepage.hero.badge';

export const HERO_SLIDES = [
  {
    id: '50gb',
    titleKey: 'homepage.hero.slides.50gb.title',
    subtitleKey: 'homepage.hero.slides.50gb.subtitle',
    image: require('@/assets/images/homepage/hero-speech.png'),
    shopJourneyId: 'browse-plans',
    detailsJourneyId: 'change-plan',
  },
  {
    id: '2gb',
    titleKey: 'homepage.hero.slides.2gb.title',
    subtitleKey: 'homepage.hero.slides.2gb.subtitle',
    image: require('@/assets/images/homepage/promo-phone.png'),
    shopJourneyId: 'browse-plans',
    detailsJourneyId: 'addon-purchase',
  },
] as const;

export const PROMO_CARDS = [
  {
    id: 'sim',
    icon: require('@/assets/images/homepage/icon-sim.png'),
    titleKey: 'homepage.promo.sim.title',
    bodyKey: 'homepage.promo.sim.body',
    ctaKey: 'homepage.promo.sim.cta',
    journeyId: 'buy-sim',
  },
  {
    id: 'topup',
    icon: require('@/assets/images/homepage/icon-wallet.png'),
    titleKey: 'homepage.promo.topup.title',
    bodyKey: 'homepage.promo.topup.body',
    ctaKey: 'homepage.promo.topup.cta',
    journeyId: 'top-up',
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    titleKey: 'homepage.howItWorks.step1.title',
    bodyKey: 'homepage.howItWorks.step1.body',
    ctaKey: 'homepage.howItWorks.step1.cta',
    journeyId: 'buy-sim',
  },
  {
    step: 2,
    titleKey: 'homepage.howItWorks.step2.title',
    bodyKey: 'homepage.howItWorks.step2.body',
    ctaKey: 'homepage.howItWorks.step2.cta',
    journeyId: 'browse-plans',
  },
  {
    step: 3,
    titleKey: 'homepage.howItWorks.step3.title',
    bodyKey: 'homepage.howItWorks.step3.body',
    ctaKey: 'homepage.howItWorks.step3.cta',
    journeyId: 'activate',
  },
] as const;

export const WHY_CHATR_ITEMS = [
  { id: 'credit', titleKey: 'homepage.whyChatr.credit.title', bodyKey: 'homepage.whyChatr.credit.body' },
  { id: 'contracts', titleKey: 'homepage.whyChatr.contracts.title', bodyKey: 'homepage.whyChatr.contracts.body' },
  { id: 'hidden', titleKey: 'homepage.whyChatr.hidden.title', bodyKey: 'homepage.whyChatr.hidden.body' },
  {
    id: 'affordable',
    titleKey: 'homepage.whyChatr.affordable.title',
    bodyKey: 'homepage.whyChatr.affordable.body',
  },
] as const;

export const TESTIMONIALS = [
  {
    id: '1',
    quoteKey: 'homepage.testimonials.items.1.quote',
    nameKey: 'homepage.testimonials.items.1.name',
    roleKey: 'homepage.testimonials.items.1.role',
    avatar: require('@/assets/images/homepage/testimonial-avatar.png'),
    rating: 5,
  },
  {
    id: '2',
    quoteKey: 'homepage.testimonials.items.2.quote',
    nameKey: 'homepage.testimonials.items.2.name',
    roleKey: 'homepage.testimonials.items.2.role',
    avatar: require('@/assets/images/assetsforchattr/marie.png'),
    rating: 5,
  },
] as const;

export const COVERAGE_FEATURES = [
  { id: 'nationwide', titleKey: 'homepage.coverage.nationwide.title', bodyKey: 'homepage.coverage.nationwide.body' },
  { id: 'reliable', titleKey: 'homepage.coverage.reliable.title', bodyKey: 'homepage.coverage.reliable.body' },
] as const;

export const HOMEPAGE_FAQ = [
  {
    id: 'purchase-sim',
    questionKey: 'homepage.faq.items.purchase-sim.question',
    answerKey: 'homepage.faq.items.purchase-sim.answer',
    journeyId: 'buy-sim',
  },
  {
    id: 'activate-sim',
    questionKey: 'homepage.faq.items.activate-sim.question',
    answerKey: 'homepage.faq.items.activate-sim.answer',
    journeyId: 'activate',
  },
  {
    id: 'roaming',
    questionKey: 'homepage.faq.items.roaming.question',
    answerKey: 'homepage.faq.items.roaming.answer',
    journeyId: 'addons',
  },
  {
    id: 'payment',
    questionKey: 'homepage.faq.items.payment.question',
    answerKey: 'homepage.faq.items.payment.answer',
    journeyId: 'top-up',
  },
  {
    id: 'change-plan',
    questionKey: 'homepage.faq.items.change-plan.question',
    answerKey: 'homepage.faq.items.change-plan.answer',
    journeyId: 'browse-plans',
  },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { labelKey: 'homepage.footer.links.plans', journeyId: 'browse-plans' },
    { labelKey: 'homepage.footer.links.phones', journeyId: 'browse-phones' },
    { labelKey: 'homepage.footer.links.simCards', journeyId: 'buy-sim' },
  ],
  support: [
    { labelKey: 'homepage.footer.links.helpCenter', journeyId: 'support' },
    { labelKey: 'homepage.footer.links.contactUs', journeyId: 'support' },
    { labelKey: 'homepage.footer.links.storeLocator', journeyId: 'stores' },
  ],
  myChatr: [
    { labelKey: 'homepage.footer.links.login', journeyId: 'sign-in' },
    { labelKey: 'homepage.footer.links.register', journeyId: 'register' },
    { labelKey: 'homepage.footer.links.topUp', journeyId: 'top-up' },
  ],
  about: [
    { labelKey: 'homepage.footer.links.aboutUs', journeyId: 'support' },
    { labelKey: 'homepage.footer.links.careers', journeyId: 'support' },
    { labelKey: 'homepage.footer.links.legal', journeyId: 'support' },
  ],
} as const;

export const FOOTER_SECTIONS = [
  { titleKey: 'homepage.footer.shop', linksKey: 'shop' as const },
  { titleKey: 'homepage.footer.support', linksKey: 'support' as const },
  { titleKey: 'homepage.footer.myChatr', linksKey: 'myChatr' as const },
  { titleKey: 'homepage.footer.about', linksKey: 'about' as const },
] as const;
