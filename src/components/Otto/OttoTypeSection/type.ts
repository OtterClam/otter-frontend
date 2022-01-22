export type OttoType = 'otto_male' | 'otto_female' | 'otto_non_gender' | 'otto_pup' | 'otto_vx';

export interface OttoTypeMetadata {
  type: OttoType;
  name: string;
  description: string;
  total: number | null;
}
