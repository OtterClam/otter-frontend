import { ThemeProvider, useMediaQuery } from '@material-ui/core';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { light, dark } from '../themes/app';

declare global {
  interface WindowEventMap {
    'change-theme': CustomEvent<{ theme: 'dark' | 'light' }>;
  }
}

const THEME_PREFERENCE_KEY = 'otter:prefers-color-scheme';

export const AppThemeContext = createContext({ name: 'light', theme: light });

export function AppThemeProvider({ children }: PropsWithChildren<{}>) {
  const themePreference = window.localStorage.getItem(THEME_PREFERENCE_KEY);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [themeConfig, setThemeConfig] = useState(() => {
    if (prefersDarkMode || themePreference === 'dark') return { name: 'dark', theme: dark };
    return { name: 'light', theme: light };
  });

  useEffect(() => {
    const saveThemeConfig = (config: { name: 'dark' | 'light'; theme: typeof light | typeof dark }) => {
      window.localStorage.setItem(THEME_PREFERENCE_KEY, config.name);
      setThemeConfig(config);
    };
    const changeThemeHandler = (event: CustomEvent<{ theme: 'dark' | 'light' }>) => {
      if (event.detail.theme === 'dark') {
        saveThemeConfig({ name: 'dark', theme: dark });
      } else {
        saveThemeConfig({ name: 'light', theme: light });
      }
    };
    window.addEventListener('change-theme', changeThemeHandler);
    return () => {
      window.removeEventListener('change-theme', changeThemeHandler);
    };
  }, []);

  return (
    <AppThemeContext.Provider value={themeConfig}>
      <ThemeProvider theme={themeConfig.theme}>{children}</ThemeProvider>
    </AppThemeContext.Provider>
  );
}
