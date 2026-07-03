type LeafletLayer = {
  addTo: (map: LeafletMap) => LeafletLayer;
  remove: () => void;
  setStyle: (style: object) => void;
};

type LeafletMap = {
  setView: (center: [number, number], zoom: number, options?: { animate?: boolean; duration?: number }) => void;
  remove: () => void;
};

export type LeafletApi = {
  map: (element: HTMLElement, options?: object) => LeafletMap;
  tileLayer: (url: string, options?: object) => { addTo: (map: LeafletMap) => void };
  polygon: (latlngs: [number, number][], options?: object) => LeafletLayer;
};

declare global {
  interface Window {
    L?: LeafletApi;
  }
}

const LEAFLET_VERSION = '1.9.4';
const LEAFLET_CSS_ID = 'chatr-leaflet-css';
const LEAFLET_SCRIPT_ID = 'chatr-leaflet-js';

let leafletLoadPromise: Promise<LeafletApi> | null = null;

export function ensureLeafletStackFix(className: string) {
  const styleId = `chatr-leaflet-stack-fix-${className}`;
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .${className} .leaflet-pane { z-index: auto !important; }
    .${className} .leaflet-tile-pane { z-index: 1 !important; }
    .${className} .leaflet-overlay-pane { z-index: 2 !important; }
    .${className} .leaflet-marker-pane { z-index: 3 !important; }
    .${className} .leaflet-tooltip-pane { z-index: 4 !important; }
    .${className} .leaflet-popup-pane { z-index: 5 !important; }
    .${className} .leaflet-control-container { z-index: 6 !important; }
  `;
  document.head.appendChild(style);
}

export function loadLeaflet(mapClassName = 'chatr-leaflet-map'): Promise<LeafletApi> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Leaflet is only available in the browser'));
  }

  if (window.L) return Promise.resolve(window.L);
  if (leafletLoadPromise) return leafletLoadPromise;

  leafletLoadPromise = new Promise((resolve, reject) => {
    if (!document.getElementById(LEAFLET_CSS_ID)) {
      const link = document.createElement('link');
      link.id = LEAFLET_CSS_ID;
      link.rel = 'stylesheet';
      link.href = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
      document.head.appendChild(link);
    }

    ensureLeafletStackFix(mapClassName);

    const existingScript = document.getElementById(LEAFLET_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.L) resolve(window.L);
        else reject(new Error('Leaflet failed to initialize'));
      });
      existingScript.addEventListener('error', () => reject(new Error('Leaflet script failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.id = LEAFLET_SCRIPT_ID;
    script.src = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;
    script.async = true;
    script.onload = () => {
      if (window.L) resolve(window.L);
      else reject(new Error('Leaflet failed to initialize'));
    };
    script.onerror = () => reject(new Error('Leaflet script failed to load'));
    document.head.appendChild(script);
  });

  return leafletLoadPromise;
}

export function regionToZoom(latitudeDelta: number) {
  return Math.min(14, Math.max(3, Math.round(Math.log2(360 / latitudeDelta) - 1)));
}
