import { Redirect } from 'expo-router';
import { useAppStore } from '@/lib/store';

export default function Index() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isLoading = useAppStore((s) => s.isLoading);

  // Wait for hydrate (and /preview iframe bootstrap) before routing — otherwise
  // guests bounce to auth landing before scenario auth is applied.
  if (isLoading) return null;

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)'} />;
}
