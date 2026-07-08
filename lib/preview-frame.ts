import type { DemoScenarioId } from './mock/types';

export const IPHONE_FRAME_SOURCE = require('@/assets/images/iPhone15ProMax.png');
export const CAMERA_SOURCE = require('@/assets/images/Camera.png');

/** sessionStorage key: parent /preview writes, iframe hydrate consumes. */
export const PREVIEW_BOOTSTRAP_KEY = 'chatr-preview-bootstrap';

export type PreviewBootstrap = {
  scenarioId?: DemoScenarioId;
  signOutFirst?: boolean;
};

/** Queue auth/scenario setup for the next iframe load (same-origin sessionStorage). */
export function queuePreviewBootstrap(bootstrap: PreviewBootstrap) {
  if (typeof sessionStorage === 'undefined') return;
  if (!bootstrap.scenarioId && !bootstrap.signOutFirst) {
    sessionStorage.removeItem(PREVIEW_BOOTSTRAP_KEY);
    return;
  }
  sessionStorage.setItem(PREVIEW_BOOTSTRAP_KEY, JSON.stringify(bootstrap));
}

/** Read and clear a pending preview bootstrap, if any. */
export function consumePreviewBootstrap(): PreviewBootstrap | null {
  if (typeof sessionStorage === 'undefined') return null;
  const raw = sessionStorage.getItem(PREVIEW_BOOTSTRAP_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(PREVIEW_BOOTSTRAP_KEY);
  try {
    return JSON.parse(raw) as PreviewBootstrap;
  } catch {
    return null;
  }
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
    return '/';
  }
  const normalized = route.startsWith('/') ? route : `/${route}`;
  return normalized;
}
