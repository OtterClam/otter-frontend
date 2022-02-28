import { Backdrop, Button } from '@material-ui/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuditedMark from 'src/components/AuditedMark';
import SocialIcons from 'src/components/SocialIcons';
import Header from '../../components/LandingHeader';
import WhiteList from '../WhiteList';
import Footer from 'src/components/common/Footer';
import SecondSection from './components/SecondSection';
import Stat from './components/Stat';
import CloseIcon from './images/icon_24x24_close.svg';
import Otter01 from './images/otter_01.png';

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
            <div className="landing__first-section__body__audited">
              <AuditedMark />
            </div>
            <a className="landing__first-section__body__app-button" href="https://app.otterclam.finance">
              <Button variant="contained" color="primary" size="medium" disableElevation>
                {t('landing.appButton')}
              </Button>
            </a>
            <SocialIcons color="blue" />
          </div>
          <div className="otter01">
            <img src={Otter01} alt="otter01" />
          </div>
        </div>
        <div className="scroll-down" />
        <div className="landing__first-section__footer">
          <div className="landing__first-section__footer__wave" />
        </div>
      </section>
      <Stat />
      <SecondSection />
      <Footer />
    </div>
  );
}

export default Landing;
