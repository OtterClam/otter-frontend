import { Carousel } from 'react-responsive-carousel';
import Ad3 from './ad-03.jpg';
import Ad4 from './ad-04.jpg';
import Ad0211 from './ad-0211.jpg';
import Ad0320 from './ad-0320.jpg';
import Ad0319 from './ad-0319.jpg';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './styles.scss';

export default function DashboardHero() {
  const ads = [
    {
      image: Ad0320,
      link: 'https://ottopia.app',
    },
    {
      image: Ad0211,
      link: 'https://www.otterclam.finance/',
    },
    {
      image: Ad0319,
      link: 'https://www.youtube.com/watch?v=b-sXdS24XS4',
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
