import { Link } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { DiscordLink, GithubLink, MediumLink, TwitterLink } from 'src/constants';
import HeaderLogo from './header-logo.png';
import './header.scss';

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  let navbarClasses = ['landing-header'];
  if (scrolled) {
    navbarClasses.push('scrolled');
  }

  return (
    <header className={navbarClasses.join(' ')}>
      <a href="https://www.otterclam.finance" className="landing-header-logo">
        <img src={HeaderLogo} alt="logo" />
      </a>
      <Link href="/#/nft">
        NFT
        <span className="landing-header__new">NEW!</span>
      </Link>
      <Link href={TwitterLink}>Twitter</Link>
      <Link href={DiscordLink}>Discord</Link>
      <Link href={GithubLink}>Github</Link>
      <Link href={MediumLink}>Medium</Link>
      {/* <Link href={DocsLink}>Docs</Link> */}
    </header>
  );
}
