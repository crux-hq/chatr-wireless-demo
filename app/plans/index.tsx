import { Redirect } from 'expo-router';
import { PlansBrowse } from '@/components/plans/PlansBrowse';
import { useAppStore } from '@/lib/store';

export default function PublicPlansScreen() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/plans" />;
  }

  return <PlansBrowse variant="public" />;
}
