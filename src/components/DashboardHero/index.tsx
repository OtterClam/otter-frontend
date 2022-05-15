import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Ad0319 from './ad-0319.jpg';
import Ad0509 from './ad-0509.jpg';
import Ad0510 from './ad-0510.jpg';
import Ad0511 from './ad-0511.jpg';
import './styles.scss';

export default function DashboardHero() {
  const ads = [
    {
      image: Ad0509,
      link: 'https://ottopia.app/leaderboard',
    },
    {
      image: Ad0510,
      link: 'https://ottopia.app/store',
    },
    {
      image: Ad0319,
      link: 'https://www.youtube.com/watch?v=9wA-6A2ONnA',
    },
    {
      image: Ad0511,
      link: 'https://www.youtube.com/watch?v=xIgPCJZuPfU',
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
