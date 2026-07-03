import { router } from 'expo-router';
import { useAppStore } from '@/lib/store';

export type AuthScreenRoute = '/sign-in' | '/register';

export function navigateToAuthScreen(route: AuthScreenRoute) {
  useAppStore.getState().signOut();
  router.replace(route);
}

export function isAuthScreenRoute(route: string): route is AuthScreenRoute {
  return route === '/sign-in' || route === '/register';
}

export function isAuthJourneyId(id: string): id is 'sign-in' | 'register' {
  return id === 'sign-in' || id === 'register';
}

export function navigateAuthJourney(id: string) {
  if (id === 'sign-in') {
    navigateToAuthScreen('/sign-in');
  } else if (id === 'register') {
    navigateToAuthScreen('/register');
  }
}
