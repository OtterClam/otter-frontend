import { SvgIcon } from '@material-ui/core';
import { ReactComponent as MAI } from '../assets/tokens/MAI.svg';

export const priceUnits = (bond: string) => {
  if (bond === 'mai') return <SvgIcon component={MAI} viewBox="0 0 32 32" style={{ height: '15px', width: '15px' }} />;

  return '$';
};
