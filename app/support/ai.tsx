import { Redirect } from 'expo-router';
import { AiSupportScreen } from '@/components/support/AiSupportScreen';
import { useAppStore } from '@/lib/store';

export default function PublicAiSupportScreen() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href={'/(tabs)/support/ai'} />;
  }

  return <AiSupportScreen showPublicFooter />;
}
