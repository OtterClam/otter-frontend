import ReactDOM from 'react-dom';
import Root from './Routes';
import store from './store/store';
import { Provider } from 'react-redux';
import { Web3ContextProvider } from './hooks';
import { ThemeProvider } from '@material-ui/core/styles';
import { light as lightTheme } from './themes';

ReactDOM.render(
  <Web3ContextProvider>
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>
        <Root />
      </ThemeProvider>
    </Provider>
  </Web3ContextProvider>,
  document.getElementById('root'),
);
