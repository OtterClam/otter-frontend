import { Box, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useTranslation, Trans, useSSR } from 'react-i18next';
import * as ActionButton from 'src/components/Button/ActionButton';
import './connect.scss';
import { useWeb3Context } from 'src/hooks';
import { useAppSelector, useAppDispatch } from 'src/store/hook';

export default function NFTConnect() {
  const { t } = useTranslation();
  const { provider, address, connect, disconnect, connected, chainID } = useWeb3Context();

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
