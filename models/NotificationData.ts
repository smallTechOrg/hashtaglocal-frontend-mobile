/**
 * The data payload of a push notification: the contract with the backend.
 *
 * The backend builds it in one place (NotificationData.java in hashtaglocal-backend); the keys,
 * types and fields are described in
 * https://github.com/smallTechOrg/hashtaglocal-backend/blob/staging/NOTIFICATION_CONTRACT.md
 * Change all three together.
 *
 * FCM delivers every value as a string, so ids stay strings here.
 */

type CommonData = {
  /** notification_log.id, used to report that the push was opened. */
  notificationLogId?: string;
};

/** Daily bulletin push: opens the bulletin page. */
export type BulletinNotificationData = CommonData & {
  type: 'BULLETIN';
  bulletinId?: string;
  localityId?: string;
  date?: string;
};

/** Chat post push (or an ops CHAT broadcast): opens the chat, switched to `hashtag` if present. */
export type ChatNotificationData = CommonData & {
  type: 'CHAT';
  feedPostId?: string;
  kind?: string;
  localityId?: string;
  hashtag?: string;
  eventId?: string;
};

/** Any push about one issue: opens the issue page. */
export type IssueDetailNotificationData = CommonData & {
  type: 'ISSUE_DETAIL';
  issueId: string;
  status?: string;
  event?: string;
  feedPostId?: string;
  localityId?: string;
  hashtag?: string;
};

/** Ops broadcast: opens the home (map) screen. */
export type BroadcastNotificationData = CommonData & {
  type: 'BROADCAST';
};

export type NotificationData =
  | BulletinNotificationData
  | ChatNotificationData
  | IssueDetailNotificationData
  | BroadcastNotificationData;

export type NotificationType = NotificationData['type'];

/**
 * The only way push data enters the app: checks the raw FCM / notifee data against the contract.
 * Returns null for anything the app can't act on (no data, an unknown type, or an ISSUE_DETAIL
 * without an issueId). Keeps only the contract's keys; blank values count as missing.
 */
export function parseNotificationData(raw: unknown): NotificationData | null {
  if (raw == null || typeof raw !== 'object') return null;
  const source = raw as Record<string, unknown>;
  const str = (key: string): string | undefined => {
    const value = source[key];
    return typeof value === 'string' && value.trim() !== '' ? value : undefined;
  };
  const common: CommonData = withoutUndefined({ notificationLogId: str('notificationLogId') });

  switch (str('type')) {
    case 'BULLETIN':
      return {
        ...common,
        type: 'BULLETIN',
        ...withoutUndefined({
          bulletinId: str('bulletinId'),
          localityId: str('localityId'),
          date: str('date'),
        }),
      };
    case 'CHAT':
      return {
        ...common,
        type: 'CHAT',
        ...withoutUndefined({
          feedPostId: str('feedPostId'),
          kind: str('kind'),
          localityId: str('localityId'),
          hashtag: str('hashtag'),
          eventId: str('eventId'),
        }),
      };
    case 'ISSUE_DETAIL': {
      const issueId = str('issueId');
      if (!issueId) return null;
      return {
        ...common,
        type: 'ISSUE_DETAIL',
        issueId,
        ...withoutUndefined({
          status: str('status'),
          event: str('event'),
          feedPostId: str('feedPostId'),
          localityId: str('localityId'),
          hashtag: str('hashtag'),
        }),
      };
    }
    case 'BROADCAST':
      return { ...common, type: 'BROADCAST' };
    default:
      return null;
  }
}

function withoutUndefined<T extends Record<string, string | undefined>>(
  fields: T,
): { [K in keyof T]?: string } {
  const out: { [K in keyof T]?: string } = {};
  for (const key of Object.keys(fields) as (keyof T)[]) {
    if (fields[key] !== undefined) out[key] = fields[key];
  }
  return out;
}
