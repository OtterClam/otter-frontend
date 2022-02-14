import App from './App';
import Landing from './Landing';
import IDO from './IDO';
import { HashRouter } from 'react-router-dom';
import { light as lightTheme } from '../themes';
import { IconButton, Theme, ThemeProvider as MuiThemeProvider } from '@material-ui/core';
import { AppThemeProvider } from 'src/helpers/app-theme-context';
import { PropsWithChildren } from 'react';
import { SnackbarKey, SnackbarProvider, useSnackbar } from 'notistack';
import { SnackbarUtilsConfigurator } from '../store/snackbarUtils';
import { Close as IconClose } from '@material-ui/icons';
import SnackbarCloseButton from './twst';

const isApp = (): boolean => {
  return window.location.host.includes('app');
};

const isIDO = (): boolean => {
  return window.location.host.includes('ido');
};

const DefaultThemeProvider = ({ children }: PropsWithChildren<{}>) => {
  return <MuiThemeProvider theme={lightTheme}>{children}</MuiThemeProvider>;
};

function Root() {
  let Content = Landing;
  let defaultTheme: Theme | undefined = lightTheme;
  let ThemeProvider = DefaultThemeProvider;

  if (isApp()) {
    Content = App;
    defaultTheme = undefined;
    ThemeProvider = AppThemeProvider;
  } else if (isIDO()) {
    Content = IDO;
  }

  return (
    <HashRouter>
      <ThemeProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
          action={snackbarKey => <SnackbarCloseButton snackbarKey={snackbarKey} />}
        >
          <SnackbarUtilsConfigurator />
          <Content />
        </SnackbarProvider>
      </ThemeProvider>
    </HashRouter>
  );
}

export default Root;
