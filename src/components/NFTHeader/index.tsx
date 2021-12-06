import { useTheme } from '@material-ui/core';
import { Link } from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';
import { LandingPageLink, DiscordLink, DocsLink, GithubLink, TwitterLink, MediumLink } from 'src/constants';
import HeaderLogo from './header-logo.png';
import './header.scss';

const useScrolled = () => {
  const [scrolled, setScrolled] = useState(false);

  const eventHandler = useCallback(() => {
    const offset = window.scrollY;
    if (offset > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', eventHandler);
  }, []);

  return scrolled;
};

const useContainerStyle = () => {
  const theme = useTheme();
  const isScrolled = useScrolled();
  return {
    backgroundColor: isScrolled ? theme.palette.mode.white : 'transparent',
    boxShadow: isScrolled ? `inset 0px -1px 0px ${theme.palette.mode.lightGray400}` : undefined,
  };
};

export default function NFTHeader() {
  const containerStyle = useContainerStyle();

  return (
    <header style={containerStyle} className="ntf-header">
      <a href={LandingPageLink} className="ntf-header__logo">
        <img src={HeaderLogo} alt="logo" className="ntf-header__logo-image" />
      </a>
      <Link className="ntf-header__link" href={LandingPageLink}>
        Claim Your CLAM
      </Link>
      <Link className="ntf-header__link" href={TwitterLink}>
        Twitter
      </Link>
      <Link className="ntf-header__link" href={DiscordLink}>
        Discord
      </Link>
      <Link className="ntf-header__link" href={GithubLink}>
        GitHub
      </Link>
      <Link className="ntf-header__link" href={MediumLink}>
        Medium
      </Link>
      <Link className="ntf-header__link" href={MediumLink}>
        Medium
      </Link>
      <Link className="ntf-header__link" href={DocsLink}>
        Docs
      </Link>
    </header>
  );
}
