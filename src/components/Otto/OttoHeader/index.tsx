import { useMediaQuery } from '@material-ui/core';
import OttoDesktopHeader from './OttoDesktopHeader';
import OttoTabletHeader from './OttoTabletHeader';
import { MENU_LINKS } from './constant';
import './style.scss';

const customMediaQuery = '(max-width: 1300px)';

export default function OttoHeader() {
  const isTablet = useMediaQuery(customMediaQuery);

  if (isTablet) return <OttoTabletHeader linkMetadata={MENU_LINKS} />;
  return <OttoDesktopHeader linkMetadata={MENU_LINKS} />;
}
