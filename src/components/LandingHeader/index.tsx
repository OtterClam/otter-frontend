import { Link } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { DiscordLink, GithubLink, MediumLink, TelegramLink, TwitterLink } from 'src/constants';
import LanguagePicker from '../LanguagePicker';
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
      <Link href="https://app.otterclam.finance/#/pearl-chests" className="nft-link">
        PEARL Chests
        <span className="landing-header__new">NEW!</span>
      </Link>
      <Link href="/#/nft" className="nft-link">
        NFT
      </Link>
      <Link href={TwitterLink}>Twitter</Link>
      <Link href={DiscordLink}>Discord</Link>
      <Link href={TelegramLink}>Telegram</Link>
      <Link href={GithubLink}>Github</Link>
      <Link href={MediumLink}>Medium</Link>
      <LanguagePicker border={false} />
      {/* <Link href={DocsLink}>Docs</Link> */}
    </header>
  );
}
