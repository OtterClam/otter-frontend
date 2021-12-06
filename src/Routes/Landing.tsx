import { Route, Switch } from 'react-router-dom';
import { NFT } from 'src/views';
import Landing from '../views/Landing';
import './style.scss';

function App() {
  return (
    <Switch>
      <Route exact path="/nft">
        <NFT />
      </Route>
      <Route component={Landing} />
    </Switch>
  );
}

export default App;
