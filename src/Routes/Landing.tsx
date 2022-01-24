import { ThemeProvider } from '@material-ui/core';
import { OttoThemeContextProvider } from 'src/hooks/theme';
import { useThemeChangedByTime } from 'src/hooks/theme';
import { Route, Switch } from 'react-router-dom';
import { dark as darkTheme } from 'src/themes/app';
import { NFT, Otto } from 'src/views';
import Landing from '../views/Landing';
import './style.scss';

function App() {
  const theme = useThemeChangedByTime();
  return (
    <Switch>
      <Route exact path="/nft">
        <ThemeProvider theme={darkTheme}>
          <NFT />
        </ThemeProvider>
      </Route>
      <Route exact path="/otto">
        <OttoThemeContextProvider value={theme}>
          <ThemeProvider theme={theme.theme}>
            <Otto />
          </ThemeProvider>
        </OttoThemeContextProvider>
      </Route>
      <Route component={Landing} />
    </Switch>
  );
}

export default App;
