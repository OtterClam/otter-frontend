import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@material-ui/core';
import OttoDesktopHeader from './OttoDesktopHeader';
import OttoTabletHeader from './OttoTabletHeader';
import { LinkMetadata } from './type';
import './style.scss';

const customMediaQuery = '(max-width: 1300px)';

export default function OttoHeader() {
  const isTablet = useMediaQuery(customMediaQuery);

  const { t } = useTranslation();
  const MENU_LINKS: LinkMetadata[] = useMemo(
    () => [
      { text: t('otto.header.bank'), href: '/FAKE/bank', new: false },
      { text: t('otto.header.otto'), href: '/FAKE/otto', new: true },
      { text: t('otto.header.market'), href: '/FAKE/market', new: false },
      { text: t('otto.header.treasury'), href: '/FAKE/treasury', new: false },
      {
        text: t('otto.header.gettingStarted'),
        href: '/FAKE',
        new: false,
      },
    ],
    [],
  );

  if (isTablet) return <OttoTabletHeader linkMetadata={MENU_LINKS} />;
  return <OttoDesktopHeader linkMetadata={MENU_LINKS} />;
}
