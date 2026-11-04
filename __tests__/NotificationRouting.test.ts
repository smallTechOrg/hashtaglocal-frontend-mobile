import { router } from "expo-router";

import { navigateFromNotification } from "@/utils/notificationService";

// notificationService pulls in native Firebase / Notifee modules; only the routing is under test.
jest.mock("@react-native-firebase/app", () => ({ getApp: jest.fn() }));
jest.mock("@react-native-firebase/messaging", () => ({
  AuthorizationStatus: { AUTHORIZED: 1, PROVISIONAL: 2 },
  getInitialNotification: jest.fn(),
  getMessaging: jest.fn(),
  getToken: jest.fn(),
  isDeviceRegisteredForRemoteMessages: jest.fn(),
  onMessage: jest.fn(),
  onNotificationOpenedApp: jest.fn(),
  onTokenRefresh: jest.fn(),
  registerDeviceForRemoteMessages: jest.fn(),
  requestPermission: jest.fn(),
}));
jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));
jest.mock("@/utils/analytics", () => ({ trackNotificationOpened: jest.fn() }));
jest.mock("@/utils/apiClient", () => ({ apiPost: jest.fn(), apiRequest: jest.fn() }));
jest.mock("@/utils/fcmCache", () => ({
  clearCachedFCMToken: jest.fn(),
  getCachedFCMToken: jest.fn(),
  setCachedFCMToken: jest.fn(),
}));
jest.mock("@/utils/notificationBannerService", () => ({ showNotificationBanner: jest.fn() }));
jest.mock("@/utils/notificationTray", () => ({
  consumeNotifeeInitialNotification: jest.fn(),
  postToSystemTray: jest.fn(),
  setupNotifeeForegroundHandler: jest.fn(),
}));

const push = router.push as jest.Mock;

describe("navigateFromNotification", () => {
  beforeEach(() => {
    push.mockClear();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("opens the bulletin screen for a BULLETIN notification, passing the bulletin identity", () => {
    // the payload the backend sends for the daily bulletin push
    navigateFromNotification({
      type: "BULLETIN",
      bulletinId: "7",
      localityId: "3",
      date: "2026-10-31",
      notificationLogId: "42",
    });

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith({
      pathname: "/bulletin",
      // notificationLogId is analytics-only, so it is not forwarded to the screen
      params: { bulletinId: "7", localityId: "3", date: "2026-10-31" },
    });
  });

  it("opens the bulletin screen for a QUIZ notification even with no payload", () => {
    navigateFromNotification({ type: "QUIZ" });

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith({ pathname: "/bulletin", params: {} });
  });

  it("forwards only the bulletin params that are present", () => {
    navigateFromNotification({ type: "BULLETIN", localityId: "3", date: "" });

    expect(push).toHaveBeenCalledWith({ pathname: "/bulletin", params: { localityId: "3" } });
  });

  it("still routes the existing notification types", () => {
    navigateFromNotification({ type: "CHAT" });
    expect(push).toHaveBeenLastCalledWith("/chat");

    navigateFromNotification({ type: "BROADCAST" });
    expect(push).toHaveBeenLastCalledWith("/");

    navigateFromNotification({ type: "ISSUE_DETAIL", issueId: "456" });
    expect(push).toHaveBeenLastCalledWith({ pathname: "/issueDetail", params: { id: "456" } });
  });

  it("opens the chat for the post's locality for a CHAT notification", () => {
    // the payload the backend sends for a chat post push
    navigateFromNotification({
      type: "CHAT",
      feedPostId: "11",
      kind: "TEXT",
      localityId: "3",
      hashtag: "koramangala",
      notificationLogId: "42",
    });

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith({ pathname: "/chat", params: { hashtag: "koramangala" } });
  });

  it("opens the issue detail page for an ISSUE_UPDATE notification", () => {
    // the payload the backend sends for "New issue in …" / "Issue resolved in …"
    navigateFromNotification({
      type: "ISSUE_UPDATE",
      issueId: "456",
      status: "RESOLVED",
      feedPostId: "12",
      localityId: "3",
      hashtag: "koramangala",
      notificationLogId: "43",
    });

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith({ pathname: "/issueDetail", params: { id: "456" } });
  });

  it("does nothing for an ISSUE_UPDATE notification without an issueId", () => {
    navigateFromNotification({ type: "ISSUE_UPDATE" });

    expect(push).not.toHaveBeenCalled();
  });

  it("does nothing for an ISSUE_DETAIL notification without an issueId", () => {
    navigateFromNotification({ type: "ISSUE_DETAIL" });

    expect(push).not.toHaveBeenCalled();
  });

  it("does nothing for an unknown type or missing data", () => {
    navigateFromNotification({ type: "SOMETHING_NEW" });
    navigateFromNotification({});
    navigateFromNotification(undefined);

    expect(push).not.toHaveBeenCalled();
  });
});
