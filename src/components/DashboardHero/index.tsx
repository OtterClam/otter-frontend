import { Carousel } from 'react-responsive-carousel';
import Ad1 from './ad-01.jpg';
import Ad2 from './ad-02.jpg';
import Ad3 from './ad-03.jpg';
import Ad4 from './ad-04.jpg';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function DashboardHero() {
  const ads = [
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
      link: 'https://www.youtube.com/watch?v=qZGGj5clzHU',
    },
  ];
  return (
    <Carousel showThumbs={false} showArrows={false} showStatus={false} autoPlay infiniteLoop>
      {ads.map(({ image, link }, i) => (
        <a key={i} href={link} target="_blank" style={{ display: 'block' }}>
          <img src={image} />
        </a>
      ))}
    </Carousel>
  );
}
