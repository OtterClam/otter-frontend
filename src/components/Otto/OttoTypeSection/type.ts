export type OttoType = 'otto_otto' | 'otto_lottie' | 'otto_cleo' | 'otto_pup' | 'otto_vx';

export interface OttoTypeMetadata {
  type: OttoType;
  name: string;
  description: string;
  total: string | null;
}
