import { SvgIcon } from '@material-ui/core';
import { ReactComponent as CLAM } from '../assets/tokens/CLAM.svg';
import { ReactComponent as StakedClam } from '../assets/tokens/sCLAM.svg';
import { ReactComponent as FRAX } from '../assets/tokens/FRAX.svg';
import { ReactComponent as MAI } from '../assets/tokens/MAI.svg';
import { ReactComponent as WMATIC } from '../assets/tokens/WMATIC.svg';
import { ReactComponent as PEARL } from '../assets/tokens/PEARL.svg';

export function getMAITokenImage(size: number = 32) {
  const style = { height: size, width: size };
  return <SvgIcon component={MAI} viewBox="0 0 32 32" style={style} />;
}

export function getCLAMTokenImage(size: number = 32) {
  const style = { height: size, width: size };
  return <SvgIcon component={CLAM} viewBox="0 0 32 32" style={style} />;
}

export function getStakedCLAMTokenImage(size: number = 32) {
  const style = { height: size, width: size };
  return <SvgIcon component={StakedClam} viewBox="0 0 32 32" style={style} />;
}

export function getPEARLTokenImage(size: number = 32) {
  const style = { height: size, width: size };
  return <SvgIcon component={PEARL} viewBox="0 0 100 100" style={style} />;
}

export function getFRAXTokenImage(size: number = 32) {
  const style = { height: size, width: size };
  return <SvgIcon component={FRAX} viewBox="0 0 32 32" style={style} />;
}

export function getWMATICTokenImage(size: number = 32) {
  const style = { height: size, width: size };
  return <SvgIcon component={WMATIC} viewBox="0 0 32 32" style={style} />;
}

export type Token = 'clam' | 'mai' | 'sclam' | 'clam2' | 'sclam2' | 'pearl' | 'frax' | 'wmatic';

export function getTokenImage(name: Token, size: number = 32): JSX.Element {
  if (name === 'mai') return getMAITokenImage(size);
  if (name === 'clam' || name === 'clam2') return getCLAMTokenImage(size);
  if (name === 'sclam' || name === 'sclam2') return getStakedCLAMTokenImage(size);
  if (name === 'pearl') return getPEARLTokenImage(size);
  if (name === 'frax') return getFRAXTokenImage(size);
  if (name === 'wmatic') return getWMATICTokenImage(size);

  throw Error(`Token image doesn't support: ${name}`);
}

function toUrl(base: string): string {
  const url = window.location.origin;
  return url + '/' + base;
}

export function getTokenUrl(name: Token) {
  if (name === 'clam' || name === 'clam2') {
    const path = require('../assets/tokens/CLAM.svg').default;
    return toUrl(path);
  }

  if (name === 'sclam' || name === 'sclam2') {
    const path = require('../assets/tokens/sCLAM.svg').default;
    return toUrl(path);
  }

  if (name === 'pearl') {
    const path = require('../assets/tokens/PEARL.svg').default;
    return toUrl(path);
  }

  throw Error(`Token url doesn't support: ${name}`);
}
