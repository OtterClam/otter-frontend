import { useEffect, useState } from 'react';
import { dark as darkTheme, light as lightTheme } from 'src/themes/app';

const MORNING_HOUR = 6;
const EVENING_HOUR = 17;
type Theme = typeof darkTheme | typeof lightTheme;

export const useThemeChangedByTime = (): Theme => {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  useEffect(() => {
    const currentHour = new Date().getHours();
    const isEvening = currentHour >= EVENING_HOUR && currentHour <= MORNING_HOUR;
    if (isEvening) return setTheme(darkTheme);
    setTheme(lightTheme);
  }, []);

  return theme;
};
