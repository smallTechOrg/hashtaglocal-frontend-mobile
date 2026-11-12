import Constants from "expo-constants";

/**
 * Returns the app's version string (e.g. "1.2.3") from the Expo config.
 * Sent to the backend on token refresh and stored as users.app_version.
 */
export function getAppVersion(): string | undefined {
  return Constants.expoConfig?.version ?? undefined;
}
