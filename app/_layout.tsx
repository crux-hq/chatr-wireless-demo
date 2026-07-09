import '../global.css';
import { useEffect, useRef } from 'react';
import { Stack, useRouter, useSegments, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import i18n from '@/lib/i18n';
import { applyDefaultFontFamily } from '@/lib/setup-fonts';
import { getPreviewCheckoutDraftSeed } from '@/lib/checkout';
import { isPreviewNavigateMessage } from '@/lib/preview-frame';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/theme/colors';
import { fontAssets } from '@/lib/theme/typography';
import { DemoAccessGate } from '@/components/layout/DemoAccessGate';
import { JourneyFab } from '@/components/layout/JourneyFab';
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
  'preview',
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

function applyPreviewNavigate(href: string, router: ReturnType<typeof useRouter>) {
  const seed = getPreviewCheckoutDraftSeed(href);
  if (seed) {
    useAppStore.getState().setActivationDraft(seed);
  }
  router.replace(href as Href);
}

function PreviewNavigateBridge() {
  const router = useRouter();
  const isLoading = useAppStore((s) => s.isLoading);
  const pendingHref = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || window.self === window.top) return;
    // Only the device iframe should soft-navigate. The /preview presenter may also
    // be nested (e.g. Cursor browser) and must ignore these messages.
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    if (path === '/preview') return;

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (!isPreviewNavigateMessage(event.data)) return;
      if (useAppStore.getState().isLoading) {
        pendingHref.current = event.data.href;
        return;
      }
      applyPreviewNavigate(event.data.href, router);
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [router]);

  useEffect(() => {
    if (typeof window === 'undefined' || window.self === window.top) return;
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    if (path === '/preview') return;
    if (isLoading || !pendingHref.current) return;
    const href = pendingHref.current;
    pendingHref.current = null;
    applyPreviewNavigate(href, router);
  }, [isLoading, router]);

  return null;
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isLoading = useAppStore((s) => s.isLoading);
  const inPreview = segments[0] === 'preview';
  const inIframe = typeof window !== 'undefined' && window.self !== window.top;

  useEffect(() => {
    if (isLoading) return;
    // Keep the presenter shell mounted — never redirect away from /preview.
    if (inPreview) return;
    // The device iframe is driven by /preview soft-nav + bootstrap. Skip guest
    // guards so parent-driven navigation is not overridden — but still promote
    // signed-in users off the auth landing after bootstrap hydrate completes.
    if (inIframe) {
      const inAuth = segments[0] === '(auth)';
      if (isAuthenticated && inAuth) {
        router.replace('/(tabs)');
      }
      return;
    }
    // Wait until Expo Router has resolved the initial route; empty segments would
    // incorrectly look "private" and bounce guests to the auth landing.
    if (segments.length === 0) return;

    const inAuth = segments[0] === '(auth)';
    const inPublic = PUBLIC_ROOTS.has(segments[0] ?? '');

    if (!isAuthenticated && !inPublic) {
      router.replace('/(auth)');
    } else if (isAuthenticated && inAuth) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, router, inPreview, inIframe]);

  // Unmounting the Stack while loading drops deep links (e.g. /plan/35gb → / → auth).
  // Keep the tree mounted for /preview and for the device iframe used by /preview.
  if (isLoading && !inPreview && !inIframe) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <PreviewNavigateBridge />
      {children}
    </>
  );
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
        <DemoAccessGate>
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
                <Stack.Screen name="preview" options={{ headerShown: false }} />
                <Stack.Screen name="demo" options={{ presentation: 'modal', headerShown: false }} />
                <Stack.Screen name="addons/[id]" options={stackCardOptions} />
              </Stack>
              <JourneyFab />
            </View>
          </AuthGate>
        </DemoAccessGate>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
