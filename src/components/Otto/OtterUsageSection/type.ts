export type UsageType = 'playable_avatar' | 'commercial_right' | 'beneficial_ecosystem';
export interface OttoUsageMetadata {
  type: UsageType;
  title: string;
  content: string;
}
