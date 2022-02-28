import { prettifySeconds } from './prettify-seconds';

export const prettyVestingPeriod = (t: any, currentBlockTime: number, vestingTime: number) => {
  if (vestingTime === 0) {
    return '';
  }

  const seconds = vestingTime - currentBlockTime;
  if (seconds < 0) {
    return t('bonds.fullyVested');
  }
  return prettifySeconds(t, seconds);
};

export const prettyShortVestingPeriod = (t: any, currentBlockTime: number, vestingTime: number): string => {
  if (vestingTime === 0) {
    return '';
  }

  const seconds = vestingTime - currentBlockTime;
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  // if redeem time is over 1 day, it shows: redeem in {number} day(s)
  if (d >= 1) {
    let hCount = h > 0 ? ', ' + h + (h == 1 ? ` ${t('time.hour')} ` : ` ${t('time.hours')} `) : '';
    return d > 0 ? d + (d == 1 ? ` ${t('time.day')}${hCount} ` : ` ${t('time.days')}${hCount} `) : '';
  }
  // if redeem time is within 1 day and over 1 hour it shows: redeem in 20 hours
  if (d < 1 && h >= 1) {
    return h > 0 ? h + (h == 1 ? ` ${t('time.hour')} ` : ` ${t('time.hours')} `) : '';
  }
  //if redeem time is within 1 hour it shows: redeem in 8 mins, 35 sec
  if (h == 0 && d == 0) {
    return (
      (m > 0 ? m + (m == 1 ? ` ${t('time.minute')}, ` : ` ${t('time.minutes')}, `) : '') +
      (s > 0 ? s + (s == 1 ? ` ${t('time.second')} ` : ` ${t('time.seconds')} `) : '')
    );
  }

  if (seconds < 0) {
    return t('bonds.fullyVested');
  }
  return prettifySeconds(t, seconds);
};
