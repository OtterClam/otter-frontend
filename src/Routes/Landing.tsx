import { ThemeProvider } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';
import { dark as darkTheme } from 'src/themes/app';
import { NFT } from 'src/views';
import Landing from '../views/Landing';
import './style.scss';

function App() {
  return (
    <Switch>
      <Route exact path="/nft">
        <ThemeProvider theme={darkTheme}>
          <NFT />
        </ThemeProvider>
      </Route>
      <Route component={Landing} />
    </Switch>
  );
}

export default App;
