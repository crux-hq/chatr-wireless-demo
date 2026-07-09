import { Redirect } from 'expo-router';
import { useAppStore } from '@/lib/store';

export default function HomeScreen() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isLoading = useAppStore((s) => s.isLoading);

  if (isLoading) return null;

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)'} />;
}
