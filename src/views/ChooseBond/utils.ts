import { BondAction, BondKey } from 'src/constants';

const actions = ['bond', 'redeem'];
export const checkBondAction = (query: string): query is BondAction => {
  return actions.includes(query);
};

// NOTE: the order is meaningful for list in bond page
const bondKeys = [
  'frax',
  'frax2',
  'frax_clam',
  'mai',
  'matic',
  'matic_clam',
  'mai44',
  'mai_clam',
  'mai_clam44',
  'mai-v1',
  'mai_clam-v1',
  'mai_clam_v2-v1',
];
export const checkBondKey = (query: string): query is BondKey => {
  return bondKeys.includes(query);
};
