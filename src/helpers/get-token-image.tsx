import { SvgIcon } from '@material-ui/core';
import { ReactComponent as MAI } from '../assets/tokens/MAI.svg';
import { ReactComponent as CLAM } from '../assets/tokens/CLAM.svg';
import { ReactComponent as StakedClam } from '../assets/tokens/sCLAM.svg';

function getMAITokenImage(size: number = 32) {
  const style = { height: size, width: size };
  return <SvgIcon component={MAI} viewBox="0 0 32 32" style={style} />;
}

function getCLAMTokenImage(size: number = 32) {
  const style = { height: size, width: size };
  return <SvgIcon component={CLAM} viewBox="0 0 32 32" style={style} />;
}

function getStakedCLAMTokenImage(size: number = 32) {
  const style = { height: size, width: size };
  return <SvgIcon component={StakedClam} viewBox="0 0 32 32" style={style} />;
}

export function getTokenImage(name: 'clam' | 'mai' | 'sclam', size?: number): JSX.Element {
  if (name === 'mai') return getMAITokenImage(size);
  if (name === 'clam') return getCLAMTokenImage(size);
  if (name === 'sclam') return getStakedCLAMTokenImage(size);

  throw Error(`Token image doesn't support: ${name}`);
}

function toUrl(base: string): string {
  const url = window.location.origin;
  return url + '/' + base;
}

export function getTokenUrl(name: string) {
  if (name === 'clam') {
    const path = require('../assets/tokens/CLAM.svg').default;
    return toUrl(path);
  }

  if (name === 'sclam') {
    const path = require('../assets/tokens/sCLAM.svg').default;
    return toUrl(path);
  }

  throw Error(`Token url doesn't support: ${name}`);
}
