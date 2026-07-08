import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Pressable } from 'react-native';

export const router = {
  push: () => undefined,
  replace: () => undefined,
  back: () => undefined,
  canGoBack: () => false,
};

export function useRouter() {
  return router;
}

export function useLocalSearchParams<T extends Record<string, string>>() {
  return {} as T;
}

export function useSegments() {
  return [] as string[];
}

export function usePathname() {
  return '/';
}

export function useFocusEffect(effect: () => void | (() => void)) {
  useEffect(() => {
    const cleanup = effect();
    return cleanup;
  }, [effect]);
}

export function Redirect() {
  return null;
}

export function Link({ children, onPress, ...props }: { children?: ReactNode; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} {...props}>
      {children}
    </Pressable>
  );
}

export const Stack = {
  Screen: () => null,
};
