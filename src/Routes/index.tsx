import App from './App';
import IDO from './IDO';
import { HashRouter } from 'react-router-dom';
import { light as lightTheme } from '../themes';
import { IconButton, Theme, ThemeProvider as MuiThemeProvider } from '@material-ui/core';
import { AppThemeProvider } from 'src/helpers/app-theme-context';
import { PropsWithChildren } from 'react';
import { SnackbarKey, SnackbarProvider, useSnackbar } from 'notistack';
import { SnackbarUtilsConfigurator } from '../store/snackbarUtils';
import { Close as IconClose } from '@material-ui/icons';

const isIDO = (): boolean => {
  return window.location.host.includes('ido');
};

const DefaultThemeProvider = ({ children }: PropsWithChildren<{}>) => {
  return <MuiThemeProvider theme={lightTheme}>{children}</MuiThemeProvider>;
};

function SnackbarCloseButton({ snackbarKey }: { snackbarKey: SnackbarKey }) {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton onClick={() => closeSnackbar(snackbarKey)}>
      <IconClose />
    </IconButton>
  );
}

function Root() {
  let Content = App;
  let ThemeProvider = AppThemeProvider;

  if (isIDO()) {
    Content = IDO;
  }

  return (
    <HashRouter>
      <ThemeProvider>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={5000}
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
