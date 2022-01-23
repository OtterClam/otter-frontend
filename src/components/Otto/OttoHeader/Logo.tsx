import { Typography, makeStyles } from '@material-ui/core';
import LogoImage from 'src/assets/images/logo.png';

const useStyles = makeStyles(theme => ({
  name: {
    color: theme.palette.mode.otterDark,
  },
  highlight: {
    color: theme.palette.otter.clamPink,
  },
}));

const Logo = () => {
  const classes = useStyles();
  return (
    <>
      <img className="otto-header-logo__image" src={LogoImage} />
      <Typography variant="h1" className={`${classes.name} otto-header-logo__text`}>
        Otter
        <Typography variant="inherit" className={classes.highlight}>
          C
        </Typography>
        lam
      </Typography>
    </>
  );
};
export default Logo;
