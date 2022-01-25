import { Carousel } from 'react-responsive-carousel';
import Ad1 from './ad-01.jpg';
import Ad2 from './ad-02.jpg';
import Ad3 from './ad-03.jpg';
import Ad4 from './ad-04.jpg';
import Ad5 from './ad-05.gif';
import Ad6 from './ad-06.gif';
import AMA from './AMA.gif';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './styles.scss';

export default function DashboardHero() {
  const ads = [
    {
      image: AMA,
      link: 'https://discord.gg/otterclam',
    },
    {
      image: Ad5,
      link: 'https://www.otterclam.finance/#/otto',
    },
    {
      image: Ad6,
      link: 'https://www.otterclam.finance/#/otto',
    },
    {
      image: Ad1,
      link: '',
    },
    {
      image: Ad2,
      link: '/#/pearl-chests',
    },
    {
      image: Ad3,
      link: 'https://www.sandbox.game/en/estates/624/',
    },
    {
      image: Ad4,
      link: 'https://www.youtube.com/watch?v=laPZp3WUt6I',
    },
  ];
  return (
    <Carousel
      className="dashboard-hero"
      interval={6000}
      showThumbs={false}
      showArrows={false}
      showStatus={false}
      autoPlay
      infiniteLoop
    >
      {ads.map(({ image, link }, i) => (
        <a key={i} href={link} target="_blank" style={{ display: 'block' }}>
          <img src={image} />
        </a>
      ))}
    </Carousel>
  );
}
