import { Redirect } from 'expo-router';
import { AddOnsBrowse } from '@/components/addons/AddOnsBrowse';
import { useAppStore } from '@/lib/store';

export default function PublicAddOnsScreen() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/add-ons" />;
  }

  return <AddOnsBrowse variant="public" />;
}
