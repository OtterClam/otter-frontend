import { useSelector } from 'react-redux';
import { prettifySeconds } from '../../helpers';
import { Box } from '@material-ui/core';
import './rebasetimer.scss';
import { Skeleton } from '@material-ui/lab';
import { useMemo } from 'react';
import { IReduxState } from '../../store/slices/state.interface';
import { useTranslation } from 'react-i18next';

function RebaseTimer() {
  const { t } = useTranslation();
  const currentBlockTime = useSelector<IReduxState, number>(state => {
    return state.app.currentBlockTime;
  });

  const nextRebase = useSelector<IReduxState, number>(state => {
    return state.app.nextRebase;
  });

  const timeUntilRebase = useMemo(() => {
    if (currentBlockTime && nextRebase) {
      const seconds = nextRebase - currentBlockTime;
      return prettifySeconds(t, seconds);
    }
  }, [currentBlockTime, nextRebase]);

  return (
    <Box className="rebase-timer">
      <p>
        {currentBlockTime ? (
          timeUntilRebase ? (
            <>
              <strong>{timeUntilRebase}</strong> {t('components.toNextHarvest')}
            </>
          ) : (
            <strong>{t('components.harvesting')}</strong>
          )
        ) : (
          <Skeleton width="200px" />
        )}
      </p>
    </Box>
  );
}

export default RebaseTimer;
