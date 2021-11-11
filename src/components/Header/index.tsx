import { AppBar, Toolbar, Box, Button, SvgIcon } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ReactComponent as MenuIcon } from '../../assets/icons/icon_24x24_hamburger.svg';
import ClamMenu from './ClamMenu';
import ConnectMenu from './ConnectMenu';
import './topbar.scss';

const drawerWidth = 280;
const transitionDuration = 969;

const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: '100%',
      padding: '20px 0 30px 0',
    },
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    background: 'transparent',
    backdropFilter: 'none',
    zIndex: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  topBar: {
    backgroundColor: theme.palette.background.default,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: transitionDuration,
    }),
    marginLeft: drawerWidth,
  },
  topBarShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: transitionDuration,
    }),
    marginLeft: 0,
  },
}));
interface IHeader {
  handleDrawerToggle: () => void;
  drawe: boolean;
}

function Header({ handleDrawerToggle, drawe }: IHeader) {
  const classes = useStyles();
  const isVerySmallScreen = useMediaQuery('(max-width: 400px)');
  return (
    <div className={`${classes.topBar} ${!drawe && classes.topBarShift}`}>
      <div style={{ maxWidth: 833, margin: 'auto', width: '89%' }}>
        <AppBar position="sticky" className={classes.appBar} elevation={0}>
          <Toolbar disableGutters className="dapp-topbar">
            {/* @ts-ignore */}
            <Button
              id="hamburger"
              aria-label="open drawer"
              edge="start"
              size="large"
              variant="text"
              color="secondary"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <SvgIcon component={MenuIcon} color="primary" />
            </Button>

            <Box display="flex">
              {!isVerySmallScreen && <ClamMenu />}

              <ConnectMenu />
            </Box>
          </Toolbar>
        </AppBar>
      </div>
    </div>
  );
}

export default Header;
