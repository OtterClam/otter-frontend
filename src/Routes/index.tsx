import { IconButton } from '@material-ui/core';
import { Close as IconClose } from '@material-ui/icons';
import { SnackbarKey, SnackbarProvider, useSnackbar } from 'notistack';
import { HashRouter } from 'react-router-dom';
import { AppThemeProvider } from 'src/helpers/app-theme-context';
import { SnackbarUtilsConfigurator } from '../store/snackbarUtils';
import App from './App';
import IDO from './IDO';

const isIDO = (): boolean => {
  return window.location.host.includes('ido');
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
