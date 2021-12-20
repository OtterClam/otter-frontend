import { Link } from '@material-ui/core';
import SlowMist from './logo_slowmist_light.png';
import styles from './styles.module.scss';

export default function AuditedMark() {
  return (
    <div className={styles.root}>
      <p>Audited by</p>
      <Link
        href="https://www.slowmist.com/en/security-audit-certificate.html?id=4d43b0eb547aa83dc2ff5bef71f99916e33b669a5f30572f1826d7e8220265c2"
        target="_blank"
      >
        <img src={SlowMist} width={80} height={18} />
      </Link>
    </div>
  );
}
