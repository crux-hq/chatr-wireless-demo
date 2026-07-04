import type { DemoScenarioId, UserProfile } from './mock/types';
import { cloneUser, DEMO_USERS } from './mock/users';

export type DemoScenario = {
  id: DemoScenarioId;
  labelEn: string;
  labelFr: string;
  descriptionEn: string;
  descriptionFr: string;
  email: string;
};

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'new-activation',
    labelEn: 'New activation',
    labelFr: 'Nouvelle activation',
    descriptionEn: 'Fresh account, no balance — ideal for activation demo',
    descriptionFr: 'Nouveau compte, sans solde — idéal pour la démo d\'activation',
    email: 'new@chatr.ca',
  },
  {
    id: 'happy-path',
    labelEn: 'Happy path',
    labelFr: 'Parcours standard',
    descriptionEn: 'Moderate usage — enroll in Auto-Pay to unlock bonus data',
    descriptionFr: 'Utilisation modérée — inscrivez-vous au paiement auto pour des données bonus',
    email: 'demo@chatr.ca',
  },
  {
    id: 'upsell-moment',
    labelEn: 'Upsell moment',
    labelFr: 'Moment de vente additionnelle',
    descriptionEn: '90% data used — upsell extra data add-on',
    descriptionFr: '90 % des données utilisées — vente de données supplémentaires',
    email: 'heavy@chatr.ca',
  },
  {
    id: 'roaming-trip',
    labelEn: 'Roaming trip',
    labelFr: 'Voyage en itinérance',
    descriptionEn: 'Active EU roaming add-on',
    descriptionFr: 'Add-on itinérance Europe actif',
    email: 'roam@chatr.ca',
  },
  {
    id: 'plan-upgrade',
    labelEn: 'Plan upgrade',
    labelFr: 'Mise à niveau du forfait',
    descriptionEn: 'On 1 GB plan — highlight 35 GB promo',
    descriptionFr: 'Forfait 1 Go — mettre en valeur la promo 35 Go',
    email: 'new@chatr.ca',
  },
];

export function getUserForScenario(scenarioId: DemoScenarioId): UserProfile {
  const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
  const email = scenario?.email ?? 'demo@chatr.ca';
  return cloneUser(DEMO_USERS[email] ?? DEMO_USERS['demo@chatr.ca']);
}

export function getUserByEmail(email: string): UserProfile | null {
  const user = DEMO_USERS[email.toLowerCase()];
  return user ? cloneUser(user) : null;
}
