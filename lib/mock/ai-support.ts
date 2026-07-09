export type AiSupportLink = {
  labelEn: string;
  labelFr: string;
  href: string;
};

export type AiSupportSuggestionGroup = 'account' | 'faq';

export type AiSupportSuggestion = {
  id: string;
  group: AiSupportSuggestionGroup;
  labelEn: string;
  labelFr: string;
  /** Keywords used to match free-text questions (lowercase). */
  keywords: string[];
  answerEn: string;
  answerFr: string;
  links: AiSupportLink[];
};

export type AiSupportResult = {
  suggestionId: string | null;
  answerEn: string;
  answerFr: string;
  links: AiSupportLink[];
};

export const AI_SUPPORT_SUGGESTIONS: AiSupportSuggestion[] = [
  {
    id: 'check-usage',
    group: 'account',
    labelEn: 'How much data do I have left?',
    labelFr: 'Combien de données me reste-t-il?',
    keywords: ['data', 'usage', 'left', 'remaining', 'balance', 'données', 'utilisation', 'reste'],
    answerEn:
      'You can see your remaining data, talk and text on the Usage page, including a daily chart for this billing cycle. If you’re running low, you can add a data pack or top up from there.',
    answerFr:
      'Vous pouvez voir vos données, minutes et textos restants sur la page Utilisation, avec un graphique quotidien pour ce cycle de facturation. Si vous manquez de données, vous pouvez ajouter un forfait ou recharger depuis cette page.',
    links: [
      { labelEn: 'View usage', labelFr: 'Voir l’utilisation', href: '/usage' },
      { labelEn: 'Browse data add-ons', labelFr: 'Voir les add-ons données', href: '/add-ons' },
    ],
  },
  {
    id: 'top-up',
    group: 'account',
    labelEn: 'How do I top up my account?',
    labelFr: 'Comment recharger mon compte?',
    keywords: ['top up', 'top-up', 'recharge', 'add money', 'payment', 'recharger', 'fonds'],
    answerEn:
      'You can top up in My chatr with a saved card, or use a prepaid voucher. Auto-Pay is the easiest way to renew on your anniversary date and unlock bonus data on eligible plans.',
    answerFr:
      'Vous pouvez recharger dans Mon chatr avec une carte enregistrée ou un bon prépayé. Le paiement auto est le moyen le plus simple de renouveler à votre date anniversaire et d’obtenir des données bonus sur les forfaits admissibles.',
    links: [
      { labelEn: 'Top up now', labelFr: 'Recharger maintenant', href: '/top-up' },
      { labelEn: 'Set up Auto-Pay', labelFr: 'Configurer le paiement auto', href: '/top-up/auto-pay' },
      { labelEn: 'Top-up help', labelFr: 'Aide recharge', href: '/support/topup-payment' },
    ],
  },
  {
    id: 'auto-pay',
    group: 'account',
    labelEn: 'How does Auto-Pay work?',
    labelFr: 'Comment fonctionne le paiement auto?',
    keywords: ['auto-pay', 'autopay', 'auto pay', 'paiement auto', 'bonus', 'renew'],
    answerEn:
      'With Auto-Pay, we charge the card on file on your anniversary date and renew your plan automatically. Eligible plans also get bonus data each cycle while you stay enrolled — you can change your card or turn Auto-Pay off anytime.',
    answerFr:
      'Avec le paiement auto, nous débitons la carte enregistrée à votre date anniversaire et renouvelons votre forfait automatiquement. Les forfaits admissibles reçoivent aussi des données bonus à chaque cycle tant que vous êtes inscrit — vous pouvez changer de carte ou désactiver le paiement auto en tout temps.',
    links: [
      { labelEn: 'Manage Auto-Pay', labelFr: 'Gérer le paiement auto', href: '/top-up/auto-pay' },
      { labelEn: 'Account home', labelFr: 'Accueil du compte', href: '/' },
    ],
  },
  {
    id: 'change-plan',
    group: 'account',
    labelEn: 'I want to change my plan',
    labelFr: 'Je veux changer de forfait',
    keywords: ['change plan', 'upgrade', 'switch plan', 'forfait', 'changer', 'upgrade'],
    answerEn:
      'You can compare prepaid plans and switch from Plan details. Province-aware pricing and inclusions are shown before you confirm — including any Auto-Pay bonus data on eligible plans.',
    answerFr:
      'Vous pouvez comparer les forfaits prépayés et changer depuis les détails du forfait. Les prix selon la province et les inclusions s’affichent avant la confirmation — y compris les données bonus du paiement auto sur les forfaits admissibles.',
    links: [
      { labelEn: 'Browse plans', labelFr: 'Voir les forfaits', href: '/plans' },
      { labelEn: '35 GB plan details', labelFr: 'Détails forfait 35 Go', href: '/plan/35gb' },
    ],
  },
  {
    id: 'payment-cards',
    group: 'account',
    labelEn: 'Where are my saved payment cards?',
    labelFr: 'Où sont mes cartes enregistrées?',
    keywords: ['card', 'cards', 'payment method', 'visa', 'carte', 'paiement'],
    answerEn:
      'Saved cards live under Top-up → Manage cards, and you can also update them from Profile. Use one card for Auto-Pay so renewals stay hands-off.',
    answerFr:
      'Les cartes enregistrées se trouvent sous Recharger → Gérer les cartes, et vous pouvez aussi les mettre à jour dans le Profil. Utilisez une carte pour le paiement auto afin que les renouvellements restent automatiques.',
    links: [
      { labelEn: 'Manage cards', labelFr: 'Gérer les cartes', href: '/top-up/cards' },
      { labelEn: 'Profile & settings', labelFr: 'Profil et paramètres', href: '/profile' },
    ],
  },
  {
    id: 'activate-sim',
    group: 'faq',
    labelEn: 'How do I activate a new SIM?',
    labelFr: 'Comment activer une nouvelle SIM?',
    keywords: ['activate', 'activation', 'sim', 'esim', 'activer'],
    answerEn:
      'Activation is a short wizard: enter your SIM number, pick a plan (with optional Auto-Pay bonus), then create your My chatr account. When you’re done, service is live and you can top up right away.',
    answerFr:
      'L’activation est un court assistant : entrez le numéro de SIM, choisissez un forfait (avec bonus paiement auto optionnel), puis créez votre compte Mon chatr. Une fois terminé, le service est actif et vous pouvez recharger tout de suite.',
    links: [
      { labelEn: 'Start activation', labelFr: 'Commencer l’activation', href: '/activate' },
      { labelEn: 'Buy a SIM', labelFr: 'Acheter une SIM', href: '/buy-sim' },
    ],
  },
  {
    id: 'coverage',
    group: 'faq',
    labelEn: 'Do you have coverage where I live?',
    labelFr: 'Avez-vous de la couverture où j’habite?',
    keywords: ['coverage', 'network', 'signal', 'map', 'couverture', 'réseau'],
    answerEn:
      'chatr runs on the Rogers network. Search any city or postal code on the coverage map to see nation-wide and extended coverage layers for your area.',
    answerFr:
      'chatr utilise le réseau Rogers. Cherchez une ville ou un code postal sur la carte de couverture pour voir les couches nationales et étendues dans votre région.',
    links: [
      { labelEn: 'Open coverage map', labelFr: 'Ouvrir la carte de couverture', href: '/coverage' },
      { labelEn: 'Coverage FAQ', labelFr: 'FAQ couverture', href: '/support/extended-coverage' },
    ],
  },
  {
    id: 'stores',
    group: 'faq',
    labelEn: 'Where is the nearest chatr store?',
    labelFr: 'Où est le magasin chatr le plus près?',
    keywords: ['store', 'stores', 'locator', 'hours', 'magasin', 'boutique'],
    answerEn:
      'Use the store locator to find nearby chatr locations with hours, directions and a one-tap call option. You can also buy a SIM or get help activating in store.',
    answerFr:
      'Utilisez le localisateur pour trouver les magasins chatr près de chez vous avec les heures, l’itinéraire et un appel en un tap. Vous pouvez aussi acheter une SIM ou obtenir de l’aide pour l’activation en magasin.',
    links: [
      { labelEn: 'Find a store', labelFr: 'Trouver un magasin', href: '/stores' },
      { labelEn: 'Browse all support', labelFr: 'Toute l’aide', href: '/support' },
    ],
  },
  {
    id: 'plan-features',
    group: 'faq',
    labelEn: 'What’s included in my plan?',
    labelFr: 'Qu’est-ce qui est inclus dans mon forfait?',
    keywords: ['included', 'inclusions', 'features', 'unlimited', 'inclus', 'caractéristiques'],
    answerEn:
      'Plan details show data, talk and text inclusions, plus any Auto-Pay bonus. You can compare plans anytime or open your current plan from the account home.',
    answerFr:
      'Les détails du forfait montrent les inclusions de données, d’appels et de textos, plus tout bonus paiement auto. Vous pouvez comparer les forfaits en tout temps ou ouvrir votre forfait actuel depuis l’accueil du compte.',
    links: [
      { labelEn: 'Compare plans', labelFr: 'Comparer les forfaits', href: '/plans' },
      { labelEn: 'Plan help', labelFr: 'Aide forfaits', href: '/support/plan-changes' },
    ],
  },
];

const FALLBACK: AiSupportResult = {
  suggestionId: null,
  answerEn:
    'I can help with account questions like usage, top-ups and Auto-Pay, or common topics like SIM activation and coverage. Try a suggested prompt below, or browse Support and visit a store if you need hands-on help.',
  answerFr:
    'Je peux aider pour le compte (utilisation, recharges, paiement auto) ou des sujets courants comme l’activation SIM et la couverture. Essayez une suggestion ci-dessous, ou parcourez l’Aide et visitez un magasin si vous avez besoin d’aide en personne.',
  links: [
    { labelEn: 'Browse Support', labelFr: 'Parcourir l’Aide', href: '/support' },
    { labelEn: 'Find a store', labelFr: 'Trouver un magasin', href: '/stores' },
  ],
};

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getAiSupportSuggestionsByGroup(group: AiSupportSuggestionGroup): AiSupportSuggestion[] {
  return AI_SUPPORT_SUGGESTIONS.filter((item) => item.group === group);
}

export function getAiSupportSuggestionById(id: string): AiSupportSuggestion | undefined {
  return AI_SUPPORT_SUGGESTIONS.find((item) => item.id === id);
}

export function matchAiSupportQuery(query: string): AiSupportResult {
  const normalized = normalizeQuery(query);
  if (!normalized) return FALLBACK;

  let best: { suggestion: AiSupportSuggestion; score: number } | null = null;

  for (const suggestion of AI_SUPPORT_SUGGESTIONS) {
    let score = 0;
    const label = normalizeQuery(suggestion.labelEn);
    const labelFr = normalizeQuery(suggestion.labelFr);
    if (normalized === label || normalized === labelFr) {
      score += 100;
    }
    if (label.includes(normalized) || normalized.includes(label) || labelFr.includes(normalized)) {
      score += 40;
    }
    for (const keyword of suggestion.keywords) {
      if (normalized.includes(keyword)) score += 10;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { suggestion, score };
    }
  }

  if (!best) return FALLBACK;

  const { suggestion } = best;
  return {
    suggestionId: suggestion.id,
    answerEn: suggestion.answerEn,
    answerFr: suggestion.answerFr,
    links: suggestion.links,
  };
}

export function resultFromSuggestion(suggestion: AiSupportSuggestion): AiSupportResult {
  return {
    suggestionId: suggestion.id,
    answerEn: suggestion.answerEn,
    answerFr: suggestion.answerFr,
    links: suggestion.links,
  };
}
