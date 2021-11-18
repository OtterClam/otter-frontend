import { SvgIcon } from '@material-ui/core';
import { BondKey } from 'src/constants';
import { ReactComponent as MAI } from '../assets/tokens/MAI.svg';

export const priceUnits = (bond: BondKey) => {
  if (bond === 'mai') return <SvgIcon component={MAI} viewBox="0 0 32 32" style={{ height: '15px', width: '15px' }} />;

  return '$';
};
