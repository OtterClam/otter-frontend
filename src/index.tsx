import ReactDOM from 'react-dom';
import Root from './Routes';
import store from './store/store';
import { Provider } from 'react-redux';
import { Web3ContextProvider } from './hooks';
import './i18n';

ReactDOM.render(
  <Web3ContextProvider>
    <Provider store={store}>
      <Root />
    </Provider>
  </Web3ContextProvider>,
  document.getElementById('root'),
);
