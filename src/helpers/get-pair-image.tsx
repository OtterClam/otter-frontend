import { SvgIcon } from '@material-ui/core';
import { ReactComponent as CLAM } from '../assets/tokens/CLAM.svg';
import { ReactComponent as MAI } from '../assets/tokens/MAI.svg';

export function getPairImage(name: string) {
  if (name.indexOf('mai') >= 0)
    return (
      <>
        <SvgIcon component={CLAM} viewBox="0 0 32 32" style={{ height: '32px', width: '32px' }} />
        <div style={{ width: '10px' }} />
        <SvgIcon component={MAI} viewBox="0 0 32 32" style={{ height: '32px', width: '32px' }} />
      </>
    );

  throw Error(`Pair image doesn't support: ${name}`);
}
