import { AppBar, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ReactComponent as MenuIcon } from '../../assets/icons/icon_24x24_hamburger.svg';
import CustomButton from '../Button/CustomButton';
import ConnectMenu from './ConnectMenu';
import './topbar.scss';

import { tabletMediaQuery } from 'src/themes/mediaQuery';

const drawerWidth = 280;
const transitionDuration = 969;

const useStyles = makeStyles(theme => ({
  appBar: {
    background: 'transparent',
    backdropFilter: 'none',
    zIndex: 10,
  },
  toolBar: {
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-end',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
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
  const isTablet = useMediaQuery(tabletMediaQuery);
  return (
    <div className={`${classes.topBar} ${!drawe && classes.topBarShift}`}>
      <div style={{ width: '100%' }}>
        <AppBar position="sticky" className={classes.appBar} elevation={0}>
          <Toolbar className={classes.toolBar}>
            {isTablet && (
              <CustomButton
                type="icon"
                bgcolor=""
                color="text.primary"
                aria-label="open drawer"
                icon={MenuIcon}
                onClick={handleDrawerToggle}
              />
            )}
            <ConnectMenu />
          </Toolbar>
        </AppBar>
      </div>
    </div>
  );
}

export default Header;
