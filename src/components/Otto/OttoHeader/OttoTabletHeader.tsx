import { Dispatch, SetStateAction, useState } from 'react';
import { Link, makeStyles } from '@material-ui/core';
import { LandingPageLink } from 'src/constants';
import NewChip from 'src/components/common/NewChip';
import LanguagePicker from 'src/components/LanguagePicker';
import Logo from './Logo';

const useStyles = makeStyles(theme => ({
  header: {
    backgroundColor: theme.palette.mode.white,
    borderBottom: `1px solid ${theme.palette.mode.lightGray400}`,
  },
}));

interface MenuButtonProps {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const MenuButton = ({ menuOpen, setMenuOpen }: MenuButtonProps) => {
  const toggleMenu = () => setMenuOpen(prevValue => !prevValue);
  return (
    <div className="menu-button" onClick={toggleMenu}>
      <div className={`menu-button__top-line-style ${menuOpen ? 'open' : ''}`}></div>
      <div className={`menu-button__middle-line-style ${menuOpen ? 'open' : ''}`}></div>
      <div className={`menu-button__bottom-line-style ${menuOpen ? 'open' : ''}`}></div>
    </div>
  );
};

const NavMenu = () => {
  return (
    <div className="otto-header-tablet__menu">
      <div>
        <a href={LandingPageLink} className="otto-header-tablet__menu-link otto-header-logo">
          <Logo />
        </a>
      </div>
      <Link className="otto-header-tablet__menu-link" href="/FAKE/bank">
        Bank
      </Link>
      <Link className="otto-header-tablet__menu-link" href="/FAKE/otto">
        Otto <NewChip marginLeft="4px" />
      </Link>
      <Link className="otto-header-tablet__menu-link" href="/FAKE/market">
        Market
      </Link>
      <Link className="otto-header-tablet__menu-link" href="/FAKE/treasury">
        Treasury
      </Link>
      <Link className="otto-header-tablet__menu-link" href="/FAKE">
        Getting Started
      </Link>
      <div id="lang-picker">
        <LanguagePicker border={false} />
      </div>
    </div>
  );
};

const OttoTabletHeader = () => {
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className={`otto-header-tablet ${classes.header}`}>
      <div className="otto-header-tablet__container">
        <div className="otto-header-tablet__patch" />
        <MenuButton menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div>
          <a href={LandingPageLink} className="otto-header-logo">
            <Logo />
          </a>
        </div>
        {/* TODO|OTTO: replace navbar links */}
        <div className="otto-header-tablet__patch" />
      </div>
      {menuOpen && <NavMenu />}
    </header>
  );
};
export default OttoTabletHeader;
