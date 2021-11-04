import { prettifySeconds } from './prettify-seconds';

export const prettyVestingPeriod = (currentBlockTime: number, vestingTime: number) => {
  if (vestingTime === 0) {
    return '';
  }

  const seconds = vestingTime - currentBlockTime;
  if (seconds < 0) {
    return 'Fully Vested';
  }
  return prettifySeconds(seconds);
};
