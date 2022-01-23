import { useEffect, useState, createContext } from 'react';
import { dark as darkTheme, light as lightTheme } from 'src/themes/app';

const MORNING_HOUR = 6;
const EVENING_HOUR = 17;
type ThemeValue = {
  name: 'dark' | 'light';
  theme: typeof darkTheme | typeof lightTheme;
};

// NOTE: it's currently used only by otto page, if you wanna use it please turn on the comments below
export const useThemeChangedByTime = (): ThemeValue => {
  const [theme, setTheme] = useState<ThemeValue>({ name: 'light', theme: lightTheme });

  useEffect(() => {
    const currentHour = new Date().getHours();
    const isNight = currentHour >= EVENING_HOUR;
    // TODO|OTTO: add dark mode layout
    // const isNight = currentHour >= EVENING_HOUR || currentHour <= MORNING_HOUR;
    // if (isNight) return setTheme({ name: 'dark', theme: darkTheme });
    setTheme({ name: 'light', theme: lightTheme });
  }, []);

  return theme;
};

export const OttoThemeContext = createContext({ name: 'light', theme: lightTheme });
export const OttoThemeContextProvider = OttoThemeContext.Provider;
