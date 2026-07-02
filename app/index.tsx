import { Redirect } from 'expo-router';
import { useAppStore } from '@/lib/store';

export default function Index() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/sign-in'} />;
}
