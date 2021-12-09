import Card from './Card';
import styles from './style.module.scss';
import HowItWorks01 from './how_it_works_01.png';
import HowItWorks02 from './how_it_works_02.png';
import HowItWorks03 from './how_it_works_03.png';
import { useTranslation } from 'react-i18next';

function SecondSection() {
  const { t } = useTranslation();
  return (
    <section className={styles.main}>
      <h2 className={styles.title}>{t('landing.splashPage.howOtterClamWorks')}</h2>
      <div className={styles.body}>
        <Card
          num={1}
          title={t('landing.splashPage.treasuryRevenue')}
          subtitle={t('landing.splashPage.bondsLPFees')}
          desc={t('landing.splashPage.bondSales')}
          img={HowItWorks01}
        />
        <Card
          num={2}
          title={t('landing.splashPage.treasuryGrowth')}
          subtitle={t('landing.splashPage.otterTreasury')}
          desc={t('landing.splashPage.treasuryInflow')}
          img={HowItWorks02}
          reverse
        />
        <Card
          num={3}
          title={t('landing.splashPage.stakingRewards')}
          subtitle={t('landing.splashPage.clamToken')}
          desc={t('landing.splashPage.treasuryInflow')}
          img={HowItWorks03}
        />
      </div>
    </section>
  );
}

export default SecondSection;
