import { hasPreviewEmbedParam } from '@/lib/preview-frame';

/** Shared demo gate password for the app and /preview. */
export const DEMO_ACCESS_PASSWORD = 'andro1dapp';

/** Legacy key from an earlier persist-on-refresh attempt. */
const LEGACY_STORAGE_KEY = 'chatr-demo-access-unlocked';

/**
 * Set when the top-level shell unlocks. Shared via localStorage so the
 * /preview device iframe (separate JS context) never paints the gate.
 * Cleared on every top-level page load so refresh re-prompts.
 */
const SESSION_UNLOCK_KEY = 'chatr-demo-access-session';

/** In-memory only for the top-level shell. */
let unlockedThisLoad = false;

/**
 * Once the device iframe decides to skip, keep skipping for the life of that
 * JS context — soft-nav can drop ?embed=1 from the URL.
 */
let skipSticky = false;

function clearLegacyUnlock(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

function readSessionUnlock(): boolean {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(SESSION_UNLOCK_KEY) === '1';
}

function writeSessionUnlock(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(SESSION_UNLOCK_KEY, '1');
}

function clearSessionUnlock(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(SESSION_UNLOCK_KEY);
}

/** Top-level refresh should always re-prompt; iframes must not clear the parent unlock. */
function resetTopLevelSessionOnLoad(): void {
  if (typeof window === 'undefined') return;
  if (window.self !== window.top) return;
  clearLegacyUnlock();
  clearSessionUnlock();
}

resetTopLevelSessionOnLoad();

/**
 * Preview device iframe inherits access from the parent shell.
 * Prefer checks that are true on the very first paint inside the iframe.
 */
export function shouldSkipDemoAccessGate(): boolean {
  if (skipSticky) return true;
  if (typeof window === 'undefined') return true;
  if (hasPreviewEmbedParam()) {
    skipSticky = true;
    return true;
  }
  if (window.self !== window.top) {
    skipSticky = true;
    return true;
  }
  if (readSessionUnlock()) {
    skipSticky = true;
    return true;
  }
  return false;
}

export function isDemoAccessUnlocked(): boolean {
  clearLegacyUnlock();
  if (shouldSkipDemoAccessGate()) return true;
  return unlockedThisLoad;
}

export function unlockDemoAccess(): void {
  unlockedThisLoad = true;
  clearLegacyUnlock();
  writeSessionUnlock();
}

export function verifyDemoAccessPassword(password: string): boolean {
  return password.trim() === DEMO_ACCESS_PASSWORD;
}
