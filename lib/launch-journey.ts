import { router } from 'expo-router';
import { DEMO_JOURNEYS, type DemoJourney } from './demo-journeys';
import type { DemoScenarioId } from './mock/types';

export function getJourneyById(id: string): DemoJourney | undefined {
  return DEMO_JOURNEYS.find((j) => j.id === id);
}

type LaunchActions = {
  signIn: (email: string, password: string) => Promise<boolean | void>;
  signOut: () => void;
  applyScenario: (id: DemoScenarioId) => Promise<void>;
};

export async function launchJourney(journey: DemoJourney, actions: LaunchActions) {
  if (journey.signOutFirst) {
    actions.signOut();
  }
  if (journey.scenarioId) {
    await actions.applyScenario(journey.scenarioId);
  } else if (journey.email?.includes('@')) {
    const password = journey.password === 'any' ? 'demo123' : (journey.password ?? 'demo123');
    await actions.signIn(journey.email, password);
  }
  router.push(journey.route as '/(tabs)');
}

export async function launchJourneyById(id: string, actions: LaunchActions) {
  const journey = getJourneyById(id);
  if (!journey) return;
  await launchJourney(journey, actions);
}
