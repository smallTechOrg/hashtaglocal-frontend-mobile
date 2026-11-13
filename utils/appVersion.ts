import Constants from "expo-constants";

/**
 * Returns the app's version string (e.g. "1.2.3") from the Expo config.
 * Sent to the backend on login and token refresh and stored as user_auth_sessions.app_version.
 */
export function getAppVersion(): string | undefined {
  return Constants.expoConfig?.version ?? undefined;
}
