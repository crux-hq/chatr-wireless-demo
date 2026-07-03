import type { LucideIcon } from 'lucide-react-native';
import {
  CreditCard,
  Smartphone,
  Radio,
  Settings,
  RefreshCw,
  Info,
} from 'lucide-react-native';

export type SupportCategoryId =
  | 'topup-payment'
  | 'network-device-sim'
  | 'extended-coverage'
  | 'my-chatr'
  | 'plan-changes'
  | 'accessibility-911';

export type SupportFaq = {
  id: string;
  questionEn: string;
  questionFr: string;
  answerEn: string;
  answerFr: string;
};

export type SupportCategory = {
  id: SupportCategoryId;
  titleEn: string;
  titleFr: string;
  faqIds: string[];
};

export const SUPPORT_FAQS: Record<string, SupportFaq> = {
  'topup-methods': {
    id: 'topup-methods',
    questionEn: 'What payment methods can I use to top up?',
    questionFr: 'Quels modes de paiement puis-je utiliser pour recharger?',
    answerEn:
      'Top up online with a credit card, Visa Debit, or Mastercard Debit in My chatr. You can also buy top-up cards at chatr stores and participating retailers.',
    answerFr:
      'Rechargez en ligne avec une carte de crédit, Visa Débit ou Mastercard Débit dans My chatr. Vous pouvez aussi acheter des cartes de recharge chez chatr et chez certains détaillants.',
  },
  'topup-balance': {
    id: 'topup-balance',
    questionEn: 'How do I check my balance after topping up?',
    questionFr: 'Comment vérifier mon solde après une recharge?',
    answerEn:
      'Sign in to My chatr online or in the app. Your updated balance appears on the dashboard within a few minutes of a successful top-up.',
    answerFr:
      'Connectez-vous à My chatr en ligne ou dans l\'application. Votre solde mis à jour apparaît sur le tableau de bord quelques minutes après une recharge réussie.',
  },
  'payment-cards': {
    id: 'payment-cards',
    questionEn: 'Where can I buy a top-up card?',
    questionFr: 'Où puis-je acheter une carte de recharge?',
    answerEn:
      'Top-up cards are available at chatr stores and select grocery, drug, gas, and convenience retailers across Canada. Use the store locator to find a location near you.',
    answerFr:
      'Les cartes de recharge sont offertes dans les magasins chatr et chez certains détaillants d\'épicerie, pharmacies, stations-service et dépanneurs partout au Canada.',
  },
  'sim-purchase': {
    id: 'sim-purchase',
    questionEn: 'How can I purchase a SIM card?',
    questionFr: 'Comment acheter une carte SIM?',
    answerEn:
      'Order a chatr SIM online for free shipping, or visit any of our 3,000+ stores coast-to-coast.',
    answerFr:
      'Commandez une carte SIM chatr en ligne avec livraison gratuite, ou visitez l\'un de nos plus de 3 000 magasins.',
  },
  'activate-sim': {
    id: 'activate-sim',
    questionEn: 'How do I activate my SIM?',
    questionFr: 'Comment activer ma carte SIM?',
    answerEn:
      'Insert your SIM, then follow the activation steps at chatrwireless.com/activate or in the My chatr app. You will need your SIM number and a plan selection.',
    answerFr:
      'Insérez votre carte SIM, puis suivez les étapes d\'activation sur chatrwireless.com/activate ou dans l\'application My chatr.',
  },
  'device-unlock': {
    id: 'device-unlock',
    questionEn: 'Is my phone compatible with chatr?',
    questionFr: 'Mon téléphone est-il compatible avec chatr?',
    answerEn:
      'Most unlocked HSPA/LTE smartphones work on the chatr network. Bring your own phone or browse phones available at chatr stores and online.',
    answerFr:
      'La plupart des téléphones intelligents HSPA/LTE déverrouillés fonctionnent sur le réseau chatr. Apportez votre propre appareil ou parcourez les téléphones offerts chez chatr.',
  },
  'extended-coverage': {
    id: 'extended-coverage',
    questionEn: 'What is Extended Coverage?',
    questionFr: 'Qu\'est-ce que la couverture étendue?',
    answerEn:
      'Extended Coverage lets you stay connected in additional areas across Canada where Rogers has partner coverage. Availability varies by location and device.',
    answerFr:
      'La couverture étendue vous permet de rester connecté dans d\'autres régions du Canada où Rogers offre une couverture partenaire. La disponibilité varie selon l\'emplacement et l\'appareil.',
  },
  'coverage-map': {
    id: 'coverage-map',
    questionEn: 'How do I check coverage in my area?',
    questionFr: 'Comment vérifier la couverture dans ma région?',
    answerEn:
      'Visit the Coverage page to see nation-wide Rogers network availability. chatr service is available wherever Rogers wireless coverage is offered.',
    answerFr:
      'Visitez la page Couverture pour voir la disponibilité du réseau Rogers partout au Canada. Le service chatr est offert partout où la couverture sans fil Rogers est disponible.',
  },
  'check-balance': {
    id: 'check-balance',
    questionEn: 'How do I check my chatr account balance?',
    questionFr: 'Comment vérifier le solde de mon compte chatr?',
    answerEn:
      'Sign in to My chatr online or in the app. Your balance and anniversary date appear on the dashboard.',
    answerFr:
      'Connectez-vous à My chatr en ligne ou dans l\'application. Votre solde et date anniversaire apparaissent sur le tableau de bord.',
  },
  'my-chatr-signin': {
    id: 'my-chatr-signin',
    questionEn: 'How do I sign in to My chatr?',
    questionFr: 'Comment me connecter à My chatr?',
    answerEn:
      'Use the email and password you registered with at sign-in. If you forgot your password, use the Forgot password link on the sign-in page.',
    answerFr:
      'Utilisez le courriel et le mot de passe avec lesquels vous vous êtes inscrit. Si vous avez oublié votre mot de passe, utilisez le lien Mot de passe oublié.',
  },
  'after-activation': {
    id: 'after-activation',
    questionEn: 'I\'ve activated my chatr account. Now what?',
    questionFr: 'J\'ai activé mon compte chatr. Et maintenant?',
    answerEn:
      'Top up your account, enroll in Auto-Pay for bonus data, and download the My chatr app to manage your usage.',
    answerFr:
      'Rechargez votre compte, inscrivez-vous au paiement automatique pour des données bonus, et téléchargez l\'application My chatr.',
  },
  'change-plan': {
    id: 'change-plan',
    questionEn: 'Can I change my plan anytime?',
    questionFr: 'Puis-je changer de forfait à tout moment?',
    answerEn:
      'Yes! chatr has no contracts. Plan changes take effect on your next anniversary date.',
    answerFr:
      'Oui! chatr n\'a pas de contrats. Les changements de forfait entrent en vigueur à votre prochaine date anniversaire.',
  },
  'plan-features': {
    id: 'plan-features',
    questionEn: 'What features are included with my plan?',
    questionFr: 'Quelles fonctionnalités sont incluses avec mon forfait?',
    answerEn:
      'Plans include talk, text, and data allotments shown at purchase. Add-ons for roaming, international long distance, and extra data can be added anytime in My chatr.',
    answerFr:
      'Les forfaits comprennent les allocations d\'appels, de textos et de données indiquées à l\'achat. Des add-ons pour l\'itinérance et les données supplémentaires peuvent être ajoutés dans My chatr.',
  },
  'autopay-bonus': {
    id: 'autopay-bonus',
    questionEn: 'How can I receive the Auto-Pay bonus?',
    questionFr: 'Comment recevoir le bonus de paiement automatique?',
    answerEn:
      'Enroll in Auto-Pay with a credit card before your anniversary date. Bonus data is added automatically each cycle.',
    answerFr:
      'Inscrivez-vous au paiement automatique avec une carte de crédit avant votre date anniversaire.',
  },
  '911-service': {
    id: '911-service',
    questionEn: 'How does 911 service work on chatr?',
    questionFr: 'Comment fonctionne le service 911 avec chatr?',
    answerEn:
      'Wireless 911 service is available where wireless coverage exists. Always provide your location to the operator. Keep your device charged and updated.',
    answerFr:
      'Le service 911 sans fil est offert là où la couverture sans fil existe. Indiquez toujours votre emplacement à l\'opérateur.',
  },
  'accessibility': {
    id: 'accessibility',
    questionEn: 'What accessibility services does chatr offer?',
    questionFr: 'Quels services d\'accessibilité chatr offre-t-il?',
    answerEn:
      'chatr supports relay services, bill formats in accessible formats, and device compatibility features. Contact support for accommodation requests.',
    answerFr:
      'chatr prend en charge les services de relais, des formats de facture accessibles et des fonctionnalités de compatibilité des appareils.',
  },
  'tsc-order': {
    id: 'tsc-order',
    questionEn: 'How do I track my TSC phone order?',
    questionFr: 'Comment suivre ma commande de téléphone TSC?',
    answerEn:
      'Check your order confirmation email for a tracking link. Orders typically ship within 3–5 business days. Contact TSC customer service for delivery updates.',
    answerFr:
      'Consultez votre courriel de confirmation pour un lien de suivi. Les commandes sont généralement expédiées dans un délai de 3 à 5 jours ouvrables.',
  },
};

export const CATEGORY_ICONS: Record<SupportCategoryId, LucideIcon> = {
  'topup-payment': CreditCard,
  'network-device-sim': Smartphone,
  'extended-coverage': Radio,
  'my-chatr': Settings,
  'plan-changes': RefreshCw,
  'accessibility-911': Info,
};

export const SUPPORT_CATEGORIES: Omit<SupportCategory, 'icon'>[] = [
  {
    id: 'topup-payment',
    titleEn: 'Top-up & payment cards',
    titleFr: 'Recharge et cartes de paiement',
    faqIds: ['topup-methods', 'topup-balance', 'payment-cards', 'add-money'],
  },
  {
    id: 'network-device-sim',
    titleEn: 'Network, device & SIM',
    titleFr: 'Réseau, appareil et SIM',
    faqIds: ['sim-purchase', 'activate-sim', 'device-unlock'],
  },
  {
    id: 'extended-coverage',
    titleEn: 'Extended Coverage',
    titleFr: 'Couverture étendue',
    faqIds: ['extended-coverage', 'coverage-map'],
  },
  {
    id: 'my-chatr',
    titleEn: 'Help with My chatr',
    titleFr: 'Aide avec My chatr',
    faqIds: ['check-balance', 'my-chatr-signin', 'after-activation'],
  },
  {
    id: 'plan-changes',
    titleEn: 'Plan changes & features',
    titleFr: 'Changements de forfait et fonctionnalités',
    faqIds: ['change-plan', 'plan-features', 'autopay-bonus'],
  },
  {
    id: 'accessibility-911',
    titleEn: '911, accessibility, and more',
    titleFr: '911, accessibilité et plus',
    faqIds: ['911-service', 'accessibility'],
  },
];

// Re-use add-money from stores FAQ_ITEMS
SUPPORT_FAQS['add-money'] = {
  id: 'add-money',
  questionEn: 'How do I add money to my chatr account?',
  questionFr: 'Comment ajouter de l\'argent à mon compte chatr?',
  answerEn: 'Use Top Up in My chatr to make a one-time payment or enroll in Auto-Pay with a saved credit card.',
  answerFr: 'Utilisez Recharger dans My chatr pour un paiement unique ou inscrivez-vous au paiement automatique.',
};

export function getCategoryById(id: string): (typeof SUPPORT_CATEGORIES)[number] | undefined {
  return SUPPORT_CATEGORIES.find((c) => c.id === id);
}

export function getFaqsForCategory(categoryId: string): SupportFaq[] {
  const category = getCategoryById(categoryId);
  if (!category) return [];
  return category.faqIds.map((faqId) => SUPPORT_FAQS[faqId]).filter(Boolean);
}

export const FEATURED_FAQ_IDS = ['tsc-order'];
