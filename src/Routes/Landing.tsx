import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3Context } from '../hooks';
import { loadAppDetails } from '../store/slices/app-slice';
import Landing from '../views/Landing';
import './style.scss';

function App() {
  const dispatch = useDispatch();

  const { readOnlyProvider, chainID, connected } = useWeb3Context();

  const loadApp = useCallback(
    loadProvider => {
      dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider }));
    },
    [connected],
  );

  useEffect(() => {
    loadApp(readOnlyProvider);
  }, []);

  return <Landing />;
}

export default App;
