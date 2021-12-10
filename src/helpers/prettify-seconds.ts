import { useTranslation } from 'react-i18next';

export const prettifySeconds = (seconds?: number, resolution?: string) => {
  if (seconds !== 0 && !seconds) {
    return '';
  }

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const { t } = useTranslation();
  if (resolution === 'day') {
    return d + (d == 1 ? ` ${t('time.day')}` : ` ${t('time.days')}`);
  }

  const dDisplay = d > 0 ? d + (d == 1 ? ` ${t('time.day')}, ` : ` ${t('time.days')}, `) : '';
  const hDisplay = h > 0 ? h + (h == 1 ? ` ${t('time.hour')}, ` : ` ${t('time.hours')}, `) : '';
  const mDisplay = m > 0 ? m + (m == 1 ? ` ${t('time.minute')} ` : ` ${t('time.minutes')} `) : '';

  return dDisplay + hDisplay + mDisplay;
};
