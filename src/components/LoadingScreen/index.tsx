import { useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import LoadingAnimation1 from 'src/assets/images/loading/loading_animation1.gif';
import LoadingAnimation2 from 'src/assets/images/loading/loading_animation2.gif';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.mode.lightGray100,
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    opacity: 1,
    pointerEvents: 'auto',
    transition: 'all 0.6s ease-out',
  },
  hide: {
    pointerEvents: 'none',
    opacity: 0,
  },
  image: {
    width: '200px',
    height: '200px',
    transition: 'all 0.3s ease-out',
    [theme.breakpoints.up('md')]: {
      width: '400px',
      height: '400px',
    },
  },
}));

interface Props {
  show: boolean;
}

const LoadingScreen = ({ show }: Props) => {
  const classes = useStyles();
  const animation = useMemo<string>(() => {
    const LoadingScreen = Math.floor(Math.random() * 2);
    if (LoadingScreen === 1) return LoadingAnimation1;
    return LoadingAnimation2;
  }, []);

  return (
    <div className={`${classes.container} ${show ? '' : classes.hide}`}>
      <img className={classes.image} src={animation} alt="loading animation" />
    </div>
  );
};
export default LoadingScreen;
