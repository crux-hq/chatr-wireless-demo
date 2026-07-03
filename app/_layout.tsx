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
import { fontAssets, fonts } from '@/lib/theme/typography';
import { JourneyFab } from '@/components/layout/JourneyFab';

SplashScreen.preventAutoHideAsync();

const stackScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.surface },
};

const stackHeaderOptions = {
  ...stackScreenOptions,
  headerStyle: { backgroundColor: colors.white },
  headerTintColor: colors.primary,
  headerTitleStyle: { fontFamily: fonts.semiBold, fontSize: 17, color: colors.text },
  headerShadowVisible: false,
  headerShown: true,
};

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
    const inHome = segments[0] === 'home';
    const inPublic = inAuth || inActivate || inDemo || inHome;

    if (!isAuthenticated && !inPublic) {
      router.replace('/home');
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
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="plan/[id]" options={{ ...stackHeaderOptions, presentation: 'card', title: 'Plan' }} />
              <Stack.Screen name="top-up/index" options={{ ...stackHeaderOptions, presentation: 'card', title: 'Top up' }} />
              <Stack.Screen name="top-up/auto-pay" options={{ ...stackHeaderOptions, presentation: 'card', title: 'Auto-Pay' }} />
              <Stack.Screen name="top-up/cards" options={{ ...stackHeaderOptions, presentation: 'card', title: 'Cards' }} />
              <Stack.Screen name="top-up/success" options={{ presentation: 'modal', headerShown: false }} />
              <Stack.Screen name="activate/index" options={{ headerShown: false }} />
              <Stack.Screen name="activate/sim" options={{ headerShown: false }} />
              <Stack.Screen name="activate/plan" options={{ headerShown: false }} />
              <Stack.Screen name="activate/account" options={{ headerShown: false }} />
              <Stack.Screen name="activate/success" options={{ headerShown: false }} />
              <Stack.Screen name="profile/index" options={{ ...stackHeaderOptions, presentation: 'card', title: 'Profile' }} />
              <Stack.Screen name="profile/edit" options={{ ...stackHeaderOptions, presentation: 'card', title: 'Edit' }} />
              <Stack.Screen name="profile/password" options={{ ...stackHeaderOptions, presentation: 'card', title: 'Password' }} />
              <Stack.Screen name="coverage/index" options={{ ...stackHeaderOptions, presentation: 'card', title: 'Coverage' }} />
              <Stack.Screen name="stores/index" options={{ ...stackHeaderOptions, presentation: 'card', title: 'Stores' }} />
              <Stack.Screen name="support/index" options={{ ...stackHeaderOptions, presentation: 'card', title: 'Support' }} />
              <Stack.Screen name="demo" options={{ presentation: 'modal', headerShown: false }} />
              <Stack.Screen name="addons/[id]" options={{ ...stackHeaderOptions, presentation: 'card', title: 'Add-on' }} />
            </Stack>
            <View pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <JourneyFab />
            </View>
          </View>
        </AuthGate>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
