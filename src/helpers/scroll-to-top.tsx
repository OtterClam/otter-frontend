import { useEffect, PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = ({ children }: PropsWithChildren<any>) => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return <>{children}</>;
};
