import { SvgIcon } from '@material-ui/core';
import { ReactComponent as CLAM } from '../assets/tokens/CLAM.svg';
import { ReactComponent as FRAX } from '../assets/tokens/FRAX.svg';
import { ReactComponent as MAI } from '../assets/tokens/MAI.svg';
import { ReactComponent as MATIC } from '../assets/tokens/WMATIC.svg';

export function getPairImage(name: string, size: number = 32) {
  const iconStyle = {
    height: `${size}px`,
    width: `${size}px`,
    zIndex: 1,
  };
  const secondIconStyle = {
    ...iconStyle,
    transform: 'translateX(-10px)',
    zIndex: 0,
  };
  if (name.indexOf('mai') >= 0) {
    return (
      <>
        <SvgIcon component={CLAM} viewBox="0 0 32 32" style={iconStyle} />
        <SvgIcon component={MAI} viewBox="0 0 32 32" style={secondIconStyle} />
      </>
    );
  }
  if (name.indexOf('frax') >= 0) {
    return (
      <>
        <SvgIcon component={CLAM} viewBox="0 0 32 32" style={{ width: size, height: size, zIndex: 1 }} />
        <SvgIcon component={FRAX} viewBox="0 0 32 32" style={secondIconStyle} />
      </>
    );
  }

  if (name.indexOf('matic') >= 0) {
    return (
      <>
        <SvgIcon component={CLAM} viewBox="0 0 32 32" style={{ width: size, height: size, zIndex: 1 }} />
        <SvgIcon component={MATIC} viewBox="0 0 32 32" style={secondIconStyle} />
      </>
    );
  }

  throw Error(`Pair image doesn't support: ${name}`);
}
