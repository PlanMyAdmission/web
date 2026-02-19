export const ROUTE_STATE_KEYS = {
  exploreUniversity: 'route-state-explore-university',
  universityDetails: 'route-state-university-details',
};
const isBrowser = typeof window !== 'undefined';
export const setRouteState = (key, value) => {
  if (!isBrowser) return;
  sessionStorage.setItem(key, JSON.stringify(value));
};
export const getRouteState = (key) => {
  if (!isBrowser) return null;
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse route state', error);
    return null;
  }
};
export const clearRouteState = (key) => {
  if (!isBrowser) return;
  sessionStorage.removeItem(key);
};
