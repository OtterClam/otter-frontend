import './landing.scss';
import { useState } from 'react';
import Header from '../../components/LandingHeader';
import Stat from './components/Stat';
import { Backdrop, Button, Link, Paper } from '@material-ui/core';
import Shell from './shell.png';
import SecondSection from './components/SecondSection';
import Footer from './components/Footer';
import { DiscordLink, GithubLink, TwitterLink } from 'src/constants';
import TwitterIcon from './images/twitter.svg';
import DiscordIcon from './images/icon_discord.svg';
import GithubIcon from './images/icon_github.svg';
import Otter01 from './images/otter_01.png';
import CloseIcon from './images/icon_24x24_close.svg';
import Countdown from './components/Countdown';
import WhiteList from '../WhiteList';

function Landing() {
  const [open, setOpen] = useState(false);

  return (
    <div className="landing">
      <Header />
      <section className="landing__first-section">
        <div className="landing__first-section__title">
          <h1>
            Otter<span style={{ color: '#FF6854' }}>C</span>lam
          </h1>
        </div>
        <div className="landing__first-section__subtitle">
          <p>Wen (3,3) becomes (🦦,🦦)</p>
        </div>
        <div className="landing__first-section__body">
          <div className="landing__first-section__body__left">
            <div className="landing__first-section__body__title">
              <p>The Decentralized</p>
              <p>Reserve Memecoin</p>
            </div>
            <div className="landing__first-section__body__subtitle">
              <p>The first store of value meme</p>
            </div>
            <a className="landing__first-section__body__app-button" href="https://app.otterclam.finance">
              <Button variant="contained" color="primary" size="medium" disableElevation>
                Enter APP
              </Button>
            </a>
            <div className="community-icons">
              <Link href={TwitterLink} className="community-icon-link">
                <img src={TwitterIcon} />
              </Link>
              <Link href={DiscordLink} className="community-icon-link">
                <img src={DiscordIcon} />
              </Link>
              <Link href={GithubLink} className="community-icon-link">
                <img src={GithubIcon} />
              </Link>
            </div>
          </div>
          <div className="otter01">
            <img src={Otter01} alt="otter01" />
          </div>
        </div>
        <div className="landing__first-section__footer">
          <img className="landing__first-section__footer__shell" src={Shell} alt="shell" />
          <div className="landing__first-section__footer__wave" />
          <div className="landing__first-section__footer__banner">
            <p>Public Launch at</p>
            <span style={{ color: '#3B4BD8' }}>Nov 3, 2021 0:00 UTC</span>
            <div className="action-buttons-container">
              <a href="https://ido.otterclam.finance">
                <Button variant="outlined" color="primary" size="medium" disableElevation>
                  Claim IDO CLAMs
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {Date.now() < 1635897600000 ? (
        <div className="countdown">
          <Countdown />
        </div>
      ) : (
        <Stat />
      )}
      <SecondSection />
      <Footer />
      <Backdrop open={open} className="whitelist-check">
        <div className="whitelist-container">
          <WhiteList />
          <div className="close-modal-button" onClick={() => setOpen(false)}>
            <img src={CloseIcon} />
          </div>
        </div>
      </Backdrop>
    </div>
  );
}

export default Landing;
