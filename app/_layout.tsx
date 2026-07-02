import '../global.css';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import { View, ActivityIndicator } from 'react-native';
import i18n from '@/lib/i18n';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/theme/colors';

function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isLoading = useAppStore((s) => s.isLoading);

  useEffect(() => {
    if (isLoading) return;
    const inAuth = segments[0] === '(auth)';
    const inActivate = segments[0] === 'activate';
    const inDemo = segments[0] === 'demo';
    const inPublic = inAuth || inActivate || inDemo;

    if (!isAuthenticated && !inPublic) {
      router.replace('/(auth)/sign-in');
    } else if (isAuthenticated && inAuth) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const hydrate = useAppStore((s) => s.hydrate);
  const locale = useAppStore((s) => s.locale);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [locale]);

  return (
    <I18nextProvider i18n={i18n}>
      <AuthGate>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="plan/[id]" options={{ presentation: 'card', headerShown: true, title: 'Plan' }} />
          <Stack.Screen name="top-up/index" options={{ presentation: 'card', headerShown: true, title: 'Top up' }} />
          <Stack.Screen name="top-up/auto-pay" options={{ presentation: 'card', headerShown: true, title: 'Auto-Pay' }} />
          <Stack.Screen name="top-up/cards" options={{ presentation: 'card', headerShown: true, title: 'Cards' }} />
          <Stack.Screen name="top-up/success" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="activate/index" />
          <Stack.Screen name="activate/sim" />
          <Stack.Screen name="activate/plan" />
          <Stack.Screen name="activate/account" />
          <Stack.Screen name="activate/success" />
          <Stack.Screen name="profile/index" options={{ presentation: 'card', headerShown: true, title: 'Profile' }} />
          <Stack.Screen name="profile/edit" options={{ presentation: 'card', headerShown: true, title: 'Edit' }} />
          <Stack.Screen name="profile/password" options={{ presentation: 'card', headerShown: true, title: 'Password' }} />
          <Stack.Screen name="coverage/index" options={{ presentation: 'card', headerShown: true, title: 'Coverage' }} />
          <Stack.Screen name="stores/index" options={{ presentation: 'card', headerShown: true, title: 'Stores' }} />
          <Stack.Screen name="support/index" options={{ presentation: 'card', headerShown: true, title: 'Support' }} />
          <Stack.Screen name="demo" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="addons/[id]" options={{ presentation: 'card', headerShown: true, title: 'Add-on' }} />
        </Stack>
      </AuthGate>
    </I18nextProvider>
  );
}
