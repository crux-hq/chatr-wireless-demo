import type { DemoScenarioId } from './mock/types';

export const IPHONE_FRAME_SOURCE = require('@/assets/images/iPhone15ProMax.png');
export const CAMERA_SOURCE = require('@/assets/images/Camera.png');

/** sessionStorage/localStorage key: parent /preview writes, iframe hydrate consumes. */
export const PREVIEW_BOOTSTRAP_KEY = 'chatr-preview-bootstrap';

/** postMessage type: parent /preview asks the device iframe to soft-navigate. */
export const PREVIEW_NAVIGATE_MESSAGE = 'chatr-preview-navigate';

/** Query flag: device iframe loads — skip the demo password gate. */
export const PREVIEW_EMBED_PARAM = 'embed';

export type PreviewBootstrap = {
  scenarioId?: DemoScenarioId;
  signOutFirst?: boolean;
};

export type PreviewNavigateMessage = {
  type: typeof PREVIEW_NAVIGATE_MESSAGE;
  href: string;
};

/** Queue auth/scenario setup for the next iframe load (same-origin localStorage —
 * sessionStorage is not shared between the /preview parent and the device iframe). */
export function queuePreviewBootstrap(bootstrap: PreviewBootstrap) {
  if (typeof localStorage === 'undefined') return;
  if (!bootstrap.scenarioId && !bootstrap.signOutFirst) {
    localStorage.removeItem(PREVIEW_BOOTSTRAP_KEY);
    return;
  }
  localStorage.setItem(PREVIEW_BOOTSTRAP_KEY, JSON.stringify(bootstrap));
}

/** Read and clear a pending preview bootstrap, if any. */
export function consumePreviewBootstrap(): PreviewBootstrap | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(PREVIEW_BOOTSTRAP_KEY);
  if (!raw) return null;
  localStorage.removeItem(PREVIEW_BOOTSTRAP_KEY);
  try {
    return JSON.parse(raw) as PreviewBootstrap;
  } catch {
    return null;
  }
}

export function isPreviewNavigateMessage(data: unknown): data is PreviewNavigateMessage {
  if (!data || typeof data !== 'object') return false;
  const message = data as Partial<PreviewNavigateMessage>;
  return message.type === PREVIEW_NAVIGATE_MESSAGE && typeof message.href === 'string';
}

/** Ask a same-origin preview iframe to router.replace without a full reload. */
export function postPreviewNavigate(target: Window, href: string) {
  target.postMessage(
    { type: PREVIEW_NAVIGATE_MESSAGE, href } satisfies PreviewNavigateMessage,
    window.location.origin,
  );
}

/** Mark a URL as the /preview device iframe so DemoAccessGate never paints. */
export function withPreviewEmbed(href: string): string {
  const hashIndex = href.indexOf('#');
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : '';
  const [path, query = ''] = withoutHash.split('?');
  const params = new URLSearchParams(query);
  params.set(PREVIEW_EMBED_PARAM, '1');
  return `${path}?${params.toString()}${hash}`;
}

export function hasPreviewEmbedParam(search?: string): boolean {
  if (typeof window === 'undefined' && search == null) return false;
  const query = search ?? window.location.search;
  return new URLSearchParams(query).get(PREVIEW_EMBED_PARAM) === '1';
}

/** Pixel dimensions of assets/images/Camera.png */
export const CAMERA_WIDTH = 96;
export const CAMERA_HEIGHT = 28;

/** Displayed size of the iPhone frame image (CSS px). */
export const DEVICE_WIDTH = 361.08;
export const DEVICE_HEIGHT = 734.43;

/** Live app iframe container inside the device (CSS px). */
export const SCREEN_LAYOUT = {
  left: 15.02,
  top: 10.15,
  width: 329.8,
  height: 712.96,
} as const;

/** Dynamic Island / camera overlay position inside the device (CSS px). */
export const CAMERA_LAYOUT = {
  left: 132.74,
  top: 24.4,
} as const;

/**
 * Simulated iOS status bar height inside the screen area (CSS px).
 * The app iframe starts below this strip so the Dynamic Island never covers app content.
 */
export const STATUS_BAR_HEIGHT = 52;

/**
 * Logical viewport width of a real iPhone 15 Pro Max (CSS px).
 * The iframe renders at this width and is scaled down to fit the frame,
 * so text/element proportions match what a real device shows.
 */
export const DEVICE_VIEWPORT_WIDTH = 430;

/** Scale factor applied to the iframe so the 430px viewport fits the frame's screen. */
export const IFRAME_SCALE = SCREEN_LAYOUT.width / DEVICE_VIEWPORT_WIDTH;

/** Logical (pre-scale) height of the iframe filling the app area below the status bar. */
export const IFRAME_VIEWPORT_HEIGHT = (SCREEN_LAYOUT.height - STATUS_BAR_HEIGHT) / IFRAME_SCALE;

export function getPreviewIframeSrc(path?: string | string[]) {
  const route = Array.isArray(path) ? path[0] : path;
  if (!route || route === '/') {
    return withPreviewEmbed('/');
  }
  const normalized = route.startsWith('/') ? route : `/${route}`;
  return withPreviewEmbed(normalized);
}
