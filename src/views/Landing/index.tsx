import './landing.scss';
import { useState } from 'react';
import Header from '../../components/LandingHeader';
import Stat from './components/Stat';
import { Backdrop, Button, Link, Paper, Popper, Typography, Fade, Box, makeStyles, SvgIcon } from '@material-ui/core';
import SecondSection from './components/SecondSection';
import Footer from './components/Footer';
import { DiscordLink, GithubLink, TwitterLink } from 'src/constants';
import TwitterIcon from './images/twitter.svg';
import DiscordIcon from './images/icon_discord.svg';
import GithubIcon from './images/icon_github.svg';
import Otter01 from './images/otter_01.png';
import CloseIcon from './images/icon_24x24_close.svg';
import WhiteList from '../WhiteList';
import { useTranslation } from 'react-i18next';

function Landing() {
  const { t, i18n } = useTranslation();
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
              <p>{t('landing.description.part1')}</p>
              <p> {t('landing.description.part2')}</p>
            </div>
            <div className="landing__first-section__body__subtitle">
              <p>{t('landing.description.tagline')}</p>
            </div>
            <a className="landing__first-section__body__app-button" href="https://app.otterclam.finance">
              <Button variant="contained" color="primary" size="medium" disableElevation>
                {t('landing.appButton')}
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
          <div className="landing__first-section__footer__wave" />
        </div>
      </section>
      <Stat />
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
