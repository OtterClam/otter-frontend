import App from './App';
import Landing from './Landing';
import IDO from './IDO';
import { HashRouter } from 'react-router-dom';
import { light as lightTheme } from '../themes';
import { ThemeProvider } from '@material-ui/core';
import { AppThemeProvider } from 'src/helpers/app-theme-context';

function Root() {
  const isApp = (): boolean => {
    return window.location.host.includes('app') || process.env.NODE_ENV === 'development';
  };

  const isIDO = (): boolean => {
    return window.location.host.includes('ido');
  };

  if (isApp()) {
    return (
      <HashRouter>
        <AppThemeProvider>
          <App />
        </AppThemeProvider>
      </HashRouter>
    );
  }

  return <ThemeProvider theme={lightTheme}>{isIDO() ? <IDO /> : <Landing />}</ThemeProvider>;
}

export default Root;
