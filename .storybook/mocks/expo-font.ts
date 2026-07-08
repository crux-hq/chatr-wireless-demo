export function useFonts(_map: Record<string, unknown>) {
  return [true, null] as const;
}

export function isLoaded(_fontFamily: string) {
  return true;
}

export function getLoadedFonts() {
  return [];
}
