import { NotificationData } from '@/models/NotificationData';

export type BannerConfig = {
  title: string;
  body: string;
  /** Parsed push data; undefined if the push carried nothing the app can open. */
  data?: NotificationData;
  trayNotificationId?: string;
};

type BannerListener = (config: BannerConfig) => void;

let _listener: BannerListener | null = null;

export function setNotificationBannerListener(fn: BannerListener | null) {
  _listener = fn;
}

export function showNotificationBanner(config: BannerConfig) {
  _listener?.(config);
}
