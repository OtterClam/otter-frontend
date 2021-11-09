import { BONDS } from '../constants';

export const bondName = (bond: string): string => {
  if (bond === BONDS.mai) return 'MAI';
  if (bond === BONDS.mai_clam) return 'CLAM-MAI LP(Legacy)';
  if (bond === BONDS.mai_clam_v2) return 'CLAM-MAI LP';

  throw Error(`Bond name doesn't support: ${bond}`);
};
