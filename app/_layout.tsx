import '../global.css';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import i18n from '@/lib/i18n';
import { applyDefaultFontFamily } from '@/lib/setup-fonts';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/theme/colors';
import { fontAssets } from '@/lib/theme/typography';
SplashScreen.preventAutoHideAsync();

const stackScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.surface },
};

const stackCardOptions = {
  ...stackScreenOptions,
  presentation: 'card' as const,
};

const PUBLIC_ROOTS = new Set([
  '(auth)',
  'activate',
  'buy-sim',
  'demo',
  'plans',
  'plan',
  'addons',
  'add-ons',
  'coverage',
  'stores',
  'support',
  'top-up',
  'phones',
  'cart',
  'checkout',
]);

function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isLoading = useAppStore((s) => s.isLoading);

  useEffect(() => {
    if (isLoading) return;
    const inAuth = segments[0] === '(auth)';
    const inPublic = PUBLIC_ROOTS.has(segments[0] ?? '');

    if (!isAuthenticated && !inPublic) {
      router.replace('/(auth)');
    } else if (isAuthenticated && inAuth) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const hydrate = useAppStore((s) => s.hydrate);
  const locale = useAppStore((s) => s.locale);

  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [locale]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      applyDefaultFontFamily();
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <AuthGate>
          <View style={{ flex: 1 }}>
            <StatusBar style="light" />
            <Stack screenOptions={stackScreenOptions}>
              <Stack.Screen name="index" />
              <Stack.Screen name="home" options={{ headerShown: false }} />
              <Stack.Screen name="plans/index" options={stackCardOptions} />
              <Stack.Screen name="add-ons/index" options={stackCardOptions} />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="plan/[id]" options={stackCardOptions} />
              <Stack.Screen name="top-up/index" options={stackCardOptions} />
              <Stack.Screen name="top-up/guest" options={stackCardOptions} />
              <Stack.Screen name="top-up/pay" options={stackCardOptions} />
              <Stack.Screen name="top-up/auto-pay" options={stackCardOptions} />
              <Stack.Screen name="top-up/cards" options={stackCardOptions} />
              <Stack.Screen name="top-up/success" options={{ presentation: 'modal', headerShown: false }} />
              <Stack.Screen name="activate/index" options={{ headerShown: false }} />
              <Stack.Screen name="buy-sim/index" options={stackCardOptions} />
              <Stack.Screen name="activate/sim" options={{ headerShown: false }} />
              <Stack.Screen name="activate/plan" options={{ headerShown: false }} />
              <Stack.Screen name="activate/account" options={{ headerShown: false }} />
              <Stack.Screen name="activate/success" options={{ headerShown: false }} />
              <Stack.Screen name="profile/index" options={stackCardOptions} />
              <Stack.Screen name="profile/edit" options={stackCardOptions} />
              <Stack.Screen name="profile/password" options={stackCardOptions} />
              <Stack.Screen name="coverage/index" options={stackCardOptions} />
              <Stack.Screen name="stores/index" options={stackCardOptions} />
              <Stack.Screen name="support/index" options={stackCardOptions} />
              <Stack.Screen name="support/[category]" options={stackCardOptions} />
              <Stack.Screen name="phones/index" options={stackCardOptions} />
              <Stack.Screen name="phones/[id]" options={stackCardOptions} />
              <Stack.Screen name="cart/index" options={stackCardOptions} />
              <Stack.Screen name="checkout/sim" options={stackCardOptions} />
              <Stack.Screen name="checkout/phone-number" options={stackCardOptions} />
              <Stack.Screen name="checkout/details" options={stackCardOptions} />
              <Stack.Screen name="checkout/payment" options={stackCardOptions} />
              <Stack.Screen name="checkout/review" options={stackCardOptions} />
              <Stack.Screen name="checkout/success" options={{ headerShown: false }} />
              <Stack.Screen name="demo" options={{ presentation: 'modal', headerShown: false }} />
              <Stack.Screen name="addons/[id]" options={stackCardOptions} />
            </Stack>
          </View>
        </AuthGate>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
