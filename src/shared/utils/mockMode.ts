// ── Mock mode toggle ──────────────────────────────────────────────────────────
// When ON (default): the app uses local seed data and never calls the backend.
// When OFF: the app calls the real API and falls back to local data on failure.
//
// Stored in sessionStorage so it resets on browser close. Toggle via the
// "Demo / Live" pill in the sidebar.

const STORAGE_KEY = "neubite_mock_mode";

/** Returns true when mock mode is active (default: true). */
export const isMockMode = (): boolean =>
  sessionStorage.getItem(STORAGE_KEY) !== "false";

/** Explicitly set mock mode on or off. */
export const setMockMode = (on: boolean): void =>
  sessionStorage.setItem(STORAGE_KEY, String(on));
