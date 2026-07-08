import { installExpoGlobalPolyfill } from 'expo-modules-core/src/polyfill/dangerous-internal';

installExpoGlobalPolyfill();

import { useEffect } from 'react';
import type { Decorator } from '@storybook/react-native-web-vite';
import { I18nextProvider } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import i18n from '@/lib/i18n';
import { applyDefaultFontFamily } from '@/lib/setup-fonts';
import { colors } from '@/lib/theme/colors';

import '../global.css';
import './fonts.css';

export const AppDecorator: Decorator = (Story) => {
  useEffect(() => {
    applyDefaultFontFamily();
  }, []);

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.gray,
            padding: 16,
            maxWidth: 480,
            width: '100%',
            alignSelf: 'center',
          }}>
          <Story />
        </View>
      </I18nextProvider>
    </SafeAreaProvider>
  );
};

export const FullWidthDecorator: Decorator = (Story) => (
  <View style={{ width: '100%', maxWidth: 960, alignSelf: 'center' }}>
    <Story />
  </View>
);

export const PrimaryBackgroundDecorator: Decorator = (Story) => (
  <View style={{ backgroundColor: colors.primary, padding: 24, borderRadius: 12 }}>
    <Story />
  </View>
);
