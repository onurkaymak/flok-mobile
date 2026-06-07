// React Native replacement for the logoutTimer exported from App.tsx in flok-v2.
// Expo Router has no App.tsx, so we keep the timer reference here instead.
export let logoutTimer: ReturnType<typeof setTimeout> | null = null;

export const setLogoutTimer = (timer: ReturnType<typeof setTimeout>) => {
  logoutTimer = timer;
};

export const clearLogoutTimer = () => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
  }
};
