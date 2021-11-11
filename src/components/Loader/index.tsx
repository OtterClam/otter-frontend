import { makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
  },
}));

function Loader() {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <CircularProgress size={120} />
    </div>
  );
}

export default Loader;
