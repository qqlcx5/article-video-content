export interface ICrawlerVideo {
  id: string;
  title: string;
  href: string;
  thumbnail: string;
  likeCount: number;
}

export type LocalStatus = "active" | "lost";

export interface ILocalVideo extends ICrawlerVideo {
  isUsed: boolean;
  isHidden: boolean;
  localStatus: LocalStatus;
  lastSeen: number;
}
