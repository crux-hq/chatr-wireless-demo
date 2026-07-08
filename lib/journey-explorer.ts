type Listener = () => void;

const listeners = new Set<Listener>();

/** Open the demo journey explorer sheet (New / Existing / app state). */
export function openJourneyExplorer() {
  listeners.forEach((listener) => listener());
}

export function onJourneyExplorerOpen(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
