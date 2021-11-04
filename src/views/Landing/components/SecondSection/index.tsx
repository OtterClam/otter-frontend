import Card from './Card';
import styles from './style.module.scss';
import HowItWorks01 from './how_it_works_01.png';
import HowItWorks02 from './how_it_works_02.png';
import HowItWorks03 from './how_it_works_03.png';

function SecondSection() {
  return (
    <section className={styles.main}>
      <h2 className={styles.title}>How OtterClam Works</h2>
      <div className={styles.body}>
        <Card
          num={1}
          title="Treasury Revenue"
          subtitle="Bonds & LP fees"
          desc="Bond sales and LP Fees increase Otter's Treasury Revenue and lock in liquidity and help control CLAM supply"
          img={HowItWorks01}
        />
        <Card
          num={2}
          title="Treasury Growth"
          subtitle="Otter's Treasury"
          desc="Treasury inflow is used to increase Otter's Treasury Balance and back outstanding CLAM tokens and regulate staking APY"
          img={HowItWorks02}
          reverse
        />
        <Card
          num={3}
          title="Staking Rewards"
          subtitle="CLAM Token"
          desc="Compounds yields automatically through a treasury backed memecoin with intrinsic value"
          img={HowItWorks03}
        />
      </div>
    </section>
  );
}

export default SecondSection;
