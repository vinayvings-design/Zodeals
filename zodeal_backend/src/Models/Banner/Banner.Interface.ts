import { Document } from "mongoose";

export const BANNER_THEMES = ["orange", "purple", "blue"] as const;
export type BannerTheme = (typeof BANNER_THEMES)[number];

export interface IBanner {
  image: string;
  badge: string;
  headline: string;
  accentText: string;
  subtitle: string;
  primaryLabel: string;
  primaryLink: string;
  secondaryLabel: string;
  secondaryLink: string;
  theme: BannerTheme;
  isActive: boolean;
  order: number;
}
export interface IBannerDocument extends IBanner, Document {}
