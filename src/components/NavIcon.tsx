import type { Screen } from "../types";

/**
 * Line icons for the navigation rail, drawn on the guide's 24px grid with
 * 1.8px strokes. Deliberately generic marks — no brand assets are redrawn.
 */
const PATHS: Record<Screen, string> = {
  calendar: "M3 5h18v16H3zM3 10h18M8 3v4M16 3v4",
  clients: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 20a5 5 0 0 0-4-4.9",
  client: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 20a5 5 0 0 0-4-4.9",
  tasks: "M9 6h12M9 12h12M9 18h12M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2",
  pipeline: "M3 4h18M6 4v16M12 4v10M18 4v13",
  products: "M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10",
  reports: "M4 20V10M10 20V4M16 20v-7M22 20H2",
};

export function NavIcon({ screen }: { screen: Screen }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={PATHS[screen]} />
    </svg>
  );
}
