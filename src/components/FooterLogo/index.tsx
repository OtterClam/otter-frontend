import HeaderLogo from 'src/assets/images/header-logo.png';
import PolygonLogo from 'src/assets/images/polygon-logo.png';
import XIcon from 'src/assets/images/x-icon.svg';
import styles from './styles.module.scss';

export default function FooterLogo() {
  return (
    <div className={styles.logos}>
      <img src={HeaderLogo} alt="logo" />
      <img src={XIcon} alt="x" style={{ width: 20, height: 20 }} />
      <img src={PolygonLogo} alt="logo" />
    </div>
  );
}
