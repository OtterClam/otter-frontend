import { getBond, BondKey } from '../constants';

export const addressForReserve = (name: BondKey, networkID: number): string => {
  return getBond(name, networkID).reserve;
};
