import { ThemeProvider, useMediaQuery } from '@material-ui/core';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { light, dark } from '../themes/app';

declare global {
  interface WindowEventMap {
    'change-theme': CustomEvent<{ theme: 'dark' | 'light' }>;
  }
}

export const AppThemeContext = createContext({ name: 'light', theme: light });

export function AppThemeProvider({ children }: PropsWithChildren<{}>) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [themeConfig, setThemeConfig] = useState(() =>
    prefersDarkMode ? { name: 'dark', theme: dark } : { name: 'light', theme: light },
  );

  useEffect(() => {
    const changeThemeHandler = (event: CustomEvent<{ theme: 'dark' | 'light' }>) => {
      switch (event.detail.theme) {
        case 'dark':
          return setThemeConfig({ name: 'dark', theme: dark });
        default:
          return setThemeConfig({ name: 'light', theme: light });
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
