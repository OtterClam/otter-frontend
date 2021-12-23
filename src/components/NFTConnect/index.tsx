import { Box, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useTranslation, Trans, useSSR } from 'react-i18next';
import * as ActionButton from 'src/components/Button/ActionButton';
import './connect.scss';
import { useAppSelector, useAppDispatch, useWeb3Context } from 'src/hooks';

const getNumber = (num: number, pos: number) => {
  if (pos === 0) {
    return Math.floor(num / 10);
  }
  return num % 10;
};

export default function NFTCountdown() {
  const { t } = useTranslation();
  const { provider, address, connect, disconnect, connected, chainID } = useWeb3Context();

  // const pendingTransactions = useAppSelector<IPendingTxn[]>(state => state.pendingTransactions);

  return (
    <section className="nft-conn">
      <Box
        className="nft-conn__content"
        color="text.primary"
        bgcolor="mode.lightGray200"
        textAlign="center"
        component="div"
      >
        <Typography variant="h4" component="h2" className="nft-conn__title">
          {connected ? t('nft.claimYourNFT') : t('nft.connectWallet')}
        </Typography>
        <Box
          border={connected ? '2px solid' : ''}
          bgcolor={connected ? 'mode.lightGray200' : 'otter.otterBlue'}
          className="nft-conn__button"
          onClick={connected ? disconnect : connect}
        >
          <p>{connected ? t('components.disconnect') : t('common.connectWallet')}</p>
        </Box>
      </Box>
    </section>
  );
}
