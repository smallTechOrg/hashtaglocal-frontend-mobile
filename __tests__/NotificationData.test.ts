import { parseNotificationData } from "@/models/NotificationData";

describe("parseNotificationData", () => {
  it("parses the backend's bulletin push", () => {
    expect(
      parseNotificationData({
        type: "BULLETIN",
        bulletinId: "7",
        localityId: "3",
        date: "2026-11-05",
        notificationLogId: "42",
      }),
    ).toEqual({
      type: "BULLETIN",
      bulletinId: "7",
      localityId: "3",
      date: "2026-11-05",
      notificationLogId: "42",
    });
  });

  it("parses the backend's chat push", () => {
    expect(
      parseNotificationData({
        type: "CHAT",
        feedPostId: "11",
        kind: "EVENT_REF",
        localityId: "3",
        hashtag: "koramangala",
        eventId: "9",
        notificationLogId: "42",
      }),
    ).toEqual({
      type: "CHAT",
      feedPostId: "11",
      kind: "EVENT_REF",
      localityId: "3",
      hashtag: "koramangala",
      eventId: "9",
      notificationLogId: "42",
    });
  });

  it("parses both kinds of issue push", () => {
    // the locality's "New issue in …" / "Issue resolved in …"
    expect(
      parseNotificationData({
        type: "ISSUE_DETAIL",
        issueId: "5",
        status: "RESOLVED",
        feedPostId: "12",
        localityId: "3",
        hashtag: "koramangala",
      }),
    ).toEqual({
      type: "ISSUE_DETAIL",
      issueId: "5",
      status: "RESOLVED",
      feedPostId: "12",
      localityId: "3",
      hashtag: "koramangala",
    });
    // the reporter's "Issue is live"
    expect(
      parseNotificationData({
        type: "ISSUE_DETAIL",
        issueId: "5",
        status: "OPEN",
        event: "STATUS_CHANGE",
      }),
    ).toEqual({ type: "ISSUE_DETAIL", issueId: "5", status: "OPEN", event: "STATUS_CHANGE" });
  });

  it("parses a broadcast", () => {
    expect(parseNotificationData({ type: "BROADCAST", notificationLogId: "1" })).toEqual({
      type: "BROADCAST",
      notificationLogId: "1",
    });
  });

  it("rejects an issue push without an issueId", () => {
    expect(parseNotificationData({ type: "ISSUE_DETAIL" })).toBeNull();
    expect(parseNotificationData({ type: "ISSUE_DETAIL", issueId: "  " })).toBeNull();
  });

  it("rejects unknown types and missing data", () => {
    expect(parseNotificationData({ type: "ISSUE_UPDATE", issueId: "5" })).toBeNull();
    expect(parseNotificationData({ type: "QUIZ" })).toBeNull();
    expect(parseNotificationData({})).toBeNull();
    expect(parseNotificationData(undefined)).toBeNull();
    expect(parseNotificationData(null)).toBeNull();
    expect(parseNotificationData("BULLETIN")).toBeNull();
  });

  it("drops keys outside the contract, blank values and non-strings", () => {
    expect(
      parseNotificationData({
        type: "CHAT",
        hashtag: "",
        feedPostId: 11,
        somethingElse: "x",
      }),
    ).toEqual({ type: "CHAT" });
  });
});
