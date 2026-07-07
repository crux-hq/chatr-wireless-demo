import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-native-web-vite';
import { expoModulesCoreShimPlugin } from './expo-modules-core-shim.ts';
import { svgReactNativePlugin } from './svg-react-native-plugin.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {
      pluginReactOptions: {
        jsxImportSource: 'nativewind',
        babel: {
          plugins: ['react-native-reanimated/plugin'],
        },
      },
      modulesToTranspile: [
        'expo',
        'expo-modules-core',
        'expo-linear-gradient',
        'expo-location',
        'expo-router',
        'lucide-react-native',
        'react-native-gifted-charts',
        'react-native-svg',
      ],
    },
  },
  docs: {
    defaultName: 'Documentation',
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      plugins: [expoModulesCoreShimPlugin(dirname), svgReactNativePlugin()],
      resolve: {
        alias: [
          { find: '@', replacement: path.resolve(dirname, '..') },
          { find: 'expo-router', replacement: path.resolve(dirname, './mocks/expo-router.tsx') },
          { find: 'expo-font', replacement: path.resolve(dirname, './mocks/expo-font.ts') },
          { find: 'react-native-maps', replacement: path.resolve(dirname, './mocks/react-native-maps.tsx') },
          {
            find: 'react-native-reanimated/scripts/validate-worklets-version',
            replacement: path.resolve(dirname, './mocks/validate-worklets-version.ts'),
          },
        ],
      },
      optimizeDeps: {
        include: ['invariant'],
        exclude: [
          'expo',
          'expo-modules-core',
          'expo-font',
          'expo-linear-gradient',
          'expo-location',
        ],
      },
    });
  },
};

export default config;
