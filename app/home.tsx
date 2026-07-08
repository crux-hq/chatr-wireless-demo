import { Redirect } from 'expo-router';
import { useAppStore } from '@/lib/store';

export default function HomeScreen() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)'} />;
}
