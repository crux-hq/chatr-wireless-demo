import { hasPreviewEmbedParam } from '@/lib/preview-frame';

/** Shared demo gate password for the app and /preview. */
export const DEMO_ACCESS_PASSWORD = 'andro1dapp';

/** Legacy key — cleared so older unlocks do not skip the gate after refresh. */
const LEGACY_STORAGE_KEY = 'chatr-demo-access-unlocked';

/** In-memory only: refresh / new tab always shows the gate again. */
let unlockedThisLoad = false;

function clearLegacyUnlock(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

/**
 * Preview device iframe inherits access from the parent shell.
 * Prefer the explicit ?embed=1 flag (available on first paint) over
 * window.self !== window.top, which can briefly look false during remounts.
 */
export function shouldSkipDemoAccessGate(): boolean {
  if (typeof window === 'undefined') return false;
  if (hasPreviewEmbedParam()) return true;
  return window.self !== window.top;
}

export function isDemoAccessUnlocked(): boolean {
  clearLegacyUnlock();
  if (shouldSkipDemoAccessGate()) return true;
  return unlockedThisLoad;
}

export function unlockDemoAccess(): void {
  unlockedThisLoad = true;
  clearLegacyUnlock();
}

export function verifyDemoAccessPassword(password: string): boolean {
  return password.trim() === DEMO_ACCESS_PASSWORD;
}
