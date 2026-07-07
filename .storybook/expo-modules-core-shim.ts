import path from 'node:path';
import type { Plugin } from 'vite';

const TS_DECLARATION_FILES = {
  './EventEmitter': 'EventEmitter.ts',
  './NativeModule': 'NativeModule.ts',
  './SharedObject': 'SharedObject.ts',
  './SharedRef': 'SharedRef.ts',
} as const;

export function expoModulesCoreShimPlugin(storybookDir: string): Plugin {
  const mocksDir = path.resolve(storybookDir, 'mocks/expo-ts-declarations');
  const polyfillWeb = path.resolve(storybookDir, 'mocks/expo-polyfill-web.ts');

  const isTsDeclarationsFile = (filePath: string) =>
    filePath.replace(/\\/g, '/').includes('expo-modules-core/src/ts-declarations/');

  return {
    name: 'expo-modules-core-shim',
    enforce: 'pre',
    resolveId(source, importer) {
      const normalizedSource = source.split('?')[0].replace(/\\/g, '/');

      if (
        normalizedSource.includes('expo-modules-core/src/polyfill/index.web') ||
        normalizedSource.endsWith('/polyfill/index.web.ts') ||
        (importer?.replace(/\\/g, '/').includes('expo-modules-core/src/ensureNativeModulesAreInstalled') &&
          normalizedSource === './polyfill')
      ) {
        return polyfillWeb;
      }

      if (importer && isTsDeclarationsFile(importer)) {
        const shim = TS_DECLARATION_FILES[normalizedSource as keyof typeof TS_DECLARATION_FILES];
        if (shim) {
          return path.resolve(mocksDir, shim);
        }
      }

      for (const [relativeImport, shim] of Object.entries(TS_DECLARATION_FILES)) {
        const fileName = relativeImport.slice(2);
        if (normalizedSource.endsWith(`expo-modules-core/src/ts-declarations/${fileName}.ts`)) {
          return path.resolve(mocksDir, shim);
        }
      }

      if (
        normalizedSource === 'invariant' ||
        normalizedSource.endsWith('/invariant/browser.js') ||
        normalizedSource.endsWith('/invariant/invariant.js')
      ) {
        return path.resolve(storybookDir, 'mocks/invariant.ts');
      }

      if (normalizedSource.includes('fontfaceobserver')) {
        return path.resolve(storybookDir, 'mocks/fontfaceobserver.ts');
      }

      if (
        normalizedSource === 'react-native-reanimated/scripts/validate-worklets-version' ||
        normalizedSource.endsWith('/react-native-reanimated/scripts/validate-worklets-version.js')
      ) {
        return path.resolve(storybookDir, 'mocks/validate-worklets-version.ts');
      }

      return null;
    },
  };
}
